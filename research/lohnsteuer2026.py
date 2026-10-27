#!/usr/bin/env python3
"""Reference implementation of the Jahreslohnsteuer 2026 (Lohnsteuer, SolZ, KiSt-BMG).

Source: BMF, Programmablaufplan für die maschinelle Berechnung der vom Arbeitslohn einzubehaltenden
Lohnsteuer 2026, Anlage 1 zum BMF-Schreiben vom 12.11.2025 (IV C 5 - S 2361/00025/016/028).

Scope: annual calculation (LZZ = 1) for current wages (laufender Arbeitslohn). Not covered:
Versorgungsbezüge, Altersentlastungsbetrag, sonstige Bezüge, Faktorverfahren, Freibetrag/Hinzurechnung.

Run without arguments to check the result against the Prüftabellen of the PAP.
"""

from decimal import ROUND_DOWN, ROUND_UP, Decimal as D

# MPARA: parameters for 2026
BBGRVALV  = D("101400")   # BBG Renten- und Arbeitslosenversicherung
BBGKVPV   = D("69750")    # BBG Kranken- und Pflegeversicherung
RVSATZAN  = D("0.0930")   # RV share of employee (18.6 % / 2)
AVSATZAN  = D("0.0130")   # ALV share of employee (2.6 % / 2)
KV_BASE   = D("0.07")     # KV ermäßigter Beitragssatz share of employee (14.0 % / 2)
GFB       = D("12348")    # Grundfreibetrag
SOLZFREI  = D("20350")    # Freigrenze SolZ (single)
W1STKL5   = D("14071")
W2STKL5   = D("34939")
W3STKL5   = D("222260")
ANP_MAX   = D("1230")     # Arbeitnehmer-Pauschbetrag
SAP       = D("36")       # Sonderausgaben-Pauschbetrag
EFA       = D("4260")     # Entlastungsbetrag für Alleinerziehende (STKL II)
KFB_HALF  = D("4878")     # Kinderfreibetrag + BEA per parent
KFB_FULL  = D("9756")
VSPHB_MAX = D("1900")     # Höchstbetrag for ALV + KV/PV (§ 39b Abs. 2 Satz 5 Nr. 3 Buchst. e EStG)


def _down(value, places=0):
    return value.quantize(D(1).scaleb(-places), rounding=ROUND_DOWN)


def _up(value, places=0):
    return value.quantize(D(1).scaleb(-places), rounding=ROUND_UP)


def uptab26(x, kztab):
    """Tarifliche Einkommensteuer nach § 32a Abs. 1 EStG (UPTAB26)."""
    if x < GFB + 1:
        st = D(0)
    elif x < 17800:
        y  = _down((x - GFB) / 10000, 6)
        st = _down((y * D("914.51") + 1400) * y)
    elif x < 69879:
        y  = _down((x - 17799) / 10000, 6)
        st = _down((y * D("173.10") + 2397) * y + D("1034.87"))
    elif x < 277826:
        st = _down(x * D("0.42") - D("11135.63"))
    else:
        st = _down(x * D("0.45") - D("19470.38"))
    return st * kztab


def _up56(zx):
    st1  = uptab26(_down(zx * D("1.25")), 1)
    st2  = uptab26(_down(zx * D("0.75")), 1)
    diff = (st1 - st2) * 2
    mist = _down(zx * D("0.14"))
    return max(mist, diff)


def mst56(x):
    """Lohnsteuer für die Steuerklassen V und VI (§ 39b Abs. 2 Satz 7 EStG)."""
    zzx = x
    if zzx > W2STKL5:
        st = _up56(W2STKL5)
        if zzx > W3STKL5:
            st = _down(st + (W3STKL5 - W2STKL5) * D("0.42"))
            st = _down(st + (zzx - W3STKL5) * D("0.45"))
        else:
            st = _down(st + (zzx - W2STKL5) * D("0.42"))
        return st

    st = _up56(zzx)
    if zzx > W1STKL5:
        vergl = st
        hoch  = _down(_up56(W1STKL5) + (zzx - W1STKL5) * D("0.42"))
        st    = min(hoch, vergl)
    return st


def vorsorgepauschale(zre4vp, stkl, krv=0, alv=0, pkv=0, kvz=D("2.90"),
                      pvs=0, pvz=0, pva=0, pkpv=D(0), pkpvagz=D(0)):
    """Vorsorgepauschale (UPEVP, MVSPKVPV, MVSPHB). pkpv and pkpvagz are monthly amounts in euro."""
    kvsatzan = kvz / 2 / 100 + KV_BASE
    pvsatzan = D("0.023") if pvs == 1 else D("0.018")
    if pvz == 1:
        pvsatzan += D("0.006")
    pvsatzan -= pva * D("0.0025")

    if krv == 1:
        vspr = D(0)
    else:
        vspr = _down(min(zre4vp, BBGRVALV) * RVSATZAN, 2)

    if pkv > 0:
        if stkl == 6:
            vspkvpv = D(0)
        else:
            vspkvpv = max(pkpv * 12 - pkpvagz * 12, D(0))
    else:
        vspkvpv = _down(min(zre4vp, BBGKVPV) * (kvsatzan + pvsatzan), 2)

    vsp = _up(vspkvpv + vspr)

    if alv != 1 and stkl != 6:
        vspalv = AVSATZAN * min(zre4vp, BBGRVALV)
        vsphb  = min(vspalv + vspkvpv, VSPHB_MAX)
        vspn   = _up(vspr + vsphb)
        vsp    = max(vsp, vspn)
    return vsp


def jahreslohnsteuer(re4, stkl, zkf=D(0), **sv):
    """Return (LSTJAHR, SOLZJ, JBMG) for an annual gross wage re4 in euro."""
    zre4 = _down(D(re4), 2)
    kztab = 2 if stkl == 3 else 1

    anp = _up(min(zre4, ANP_MAX)) if stkl < 6 else D(0)
    sap = SAP if stkl < 6 else D(0)
    efa = EFA if stkl == 2 else D(0)
    ztabfb = _down(efa + anp + sap, 2)

    if stkl in (1, 2, 3):
        kfb = _down(zkf * KFB_FULL)
    elif stkl == 4:
        kfb = _down(zkf * KFB_HALF)
    else:
        kfb = D(0)

    vsp = vorsorgepauschale(zre4, stkl, **sv)

    def lst(tabfb):
        zve = max(zre4 - tabfb - vsp, D(0))
        x   = _down(zve / kztab)
        return uptab26(x, kztab) if stkl < 5 else mst56(x)

    lstjahr = lst(ztabfb)
    jbmg    = lst(ztabfb + kfb) if zkf > 0 else lstjahr

    solzfrei = SOLZFREI * kztab
    if jbmg > solzfrei:
        solzj   = _down(jbmg * D("5.5") / 100, 2)
        solzmin = _down((jbmg - solzfrei) * D("11.9") / 100, 2)
        solzj   = min(solzj, solzmin)
    else:
        solzj = D(0)
    return lstjahr, solzj, jbmg


# Prüftabellen of the PAP 2026 (page 39 and 40): gross wage -> Lohnsteuer for STKL I..VI.
_ALLGEMEIN = """
5000 0 0 0 0 372 558
7500 0 0 0 0 647 838
10000 0 0 0 0 922 1117
12500 0 0 0 0 1197 1397
15000 0 0 0 0 1472 1676
17500 51 0 0 51 1778 1956
20000 380 0 0 380 2234 2766
22500 782 32 0 782 3073 3604
25000 1251 359 0 1251 3911 4443
27500 1742 759 0 1742 4749 5281
30000 2248 1230 0 2248 5588 6120
32500 2767 1724 0 2767 6426 6952
35000 3300 2233 294 3300 7216 7682
37500 3847 2756 628 3847 7954 8436
40000 4407 3293 1000 4407 8720 9218
42500 4982 3843 1406 4982 9512 10030
45000 5570 4408 1850 5570 10334 10865
47500 6172 4987 2324 6172 11171 11703
50000 6788 5580 2810 6788 12010 12542
52500 7417 6186 3302 7417 12848 13380
55000 8060 6807 3802 8060 13687 14218
57500 8718 7442 4308 8718 14525 15057
60000 9389 8091 4822 9389 15364 15895
62500 10073 8754 5342 10073 16202 16734
65000 10772 9430 5870 10772 17040 17572
67500 11484 10121 6402 11484 17879 18410
70000 12220 10835 6952 12220 18729 19260
72500 13062 11647 7574 13062 19681 20213
75000 13922 12476 8206 13922 20633 21165
77500 14799 13323 8846 14799 21585 22117
80000 15694 14188 9496 15694 22538 23070
82500 16607 15071 10154 16607 23490 24022
85000 17538 15971 10822 17538 24443 24974
87500 18486 16890 11498 18486 25395 25927
90000 19438 17826 12182 19438 26347 26879
92500 20390 18777 12876 20390 27300 27831
95000 21343 19729 13580 21343 28252 28784
97500 22295 20682 14292 22295 29204 29736
100000 23248 21634 15012 23248 30157 30689
102500 24243 22629 15774 24243 31152 31684
105000 25293 23679 16590 25293 32202 32734
107500 26343 24729 17416 26343 33252 33784
110000 27393 25779 18252 27393 34302 34834
"""

_BESONDERS = """
5000 0 0 0 0 18 700
7500 0 0 0 0 368 1050
10000 0 0 0 0 718 1400
12500 0 0 0 0 1068 1750
15000 0 0 0 0 1418 2359
17500 40 0 0 40 1768 3409
20000 461 0 0 461 2415 4459
22500 995 153 0 995 3465 5509
25000 1604 607 0 1604 4515 6559
27500 2234 1173 0 2234 5565 7514
30000 2886 1788 0 2886 6615 8460
32500 3559 2424 76 3559 7564 9446
35000 4254 3083 466 4254 8510 10473
37500 4971 3763 914 4971 9498 11523
40000 5710 4464 1420 5710 10529 12573
42500 6470 5188 1982 6470 11579 13623
45000 7252 5932 2584 7252 12629 14673
47500 8055 6699 3198 8055 13679 15723
50000 8880 7487 3824 8880 14729 16773
52500 9727 8297 4458 9727 15779 17823
55000 10595 9128 5106 10595 16829 18873
57500 11485 9981 5762 11485 17879 19923
60000 12396 10856 6430 12396 18929 20973
62500 13330 11752 7110 13330 19979 22023
65000 14284 12670 7798 14284 21029 23073
67500 15261 13610 8500 15261 22079 24123
70000 16259 14571 9210 16259 23129 25173
72500 17279 15554 9932 17279 24179 26223
75000 18320 16559 10666 18320 25229 27273
77500 19370 17585 11410 19370 26279 28323
80000 20420 18631 12164 20420 27329 29373
82500 21470 19681 12930 21470 28379 30423
85000 22520 20731 13706 22520 29429 31473
87500 23570 21781 14492 23570 30479 32523
90000 24620 22831 15290 24620 31529 33573
92500 25670 23881 16098 25670 32579 34623
95000 26720 24931 16918 26720 33629 35673
97500 27770 25981 17748 27770 34679 36723
100000 28820 27031 18590 28820 35729 37773
102500 29870 28081 19442 29870 36779 38823
105000 30920 29131 20304 30920 37829 39873
107500 31970 30181 21178 31970 38879 40923
110000 33020 31231 22062 33020 39929 41973
"""


def _check():
    failures = 0
    for label, table in (("allgemein", _ALLGEMEIN), ("besonders", _BESONDERS)):
        for line in table.strip().splitlines():
            re4, *expected = (int(v) for v in line.split())
            for stkl, exp in enumerate(expected, start=1):
                if label == "allgemein":
                    sv = {"kvz": D("2.90"), "pvz": 0 if stkl == 2 else 1}
                else:
                    pkpv = {3: 50000, 6: 0}.get(stkl, 30000)
                    sv = {"krv": 1, "alv": 1, "pkv": 1, "pkpv": D(pkpv) / 100}
                got = jahreslohnsteuer(re4, stkl, **sv)[0]
                if got != exp:
                    failures += 1
                    print(f"FAIL {label} RE4={re4} STKL={stkl}: got {got}, expected {exp}")
    print("OK" if failures == 0 else f"{failures} failures")
    return failures


if __name__ == "__main__":
    raise SystemExit(1 if _check() else 0)
