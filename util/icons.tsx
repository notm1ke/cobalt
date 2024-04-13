import React from 'react';
import MdiIcon from '@mdi/react';

import { AnySite, ResolvableBuildingCode } from '.';
import { DiningHallStatus, DiningHallType } from '@ilefa/blueplate';

import {
    mdiAbacus,
    mdiAccountMultiple,
    mdiAccountQuestion,
    mdiAccountTie,
    mdiAccountVoice,
    mdiAlphabetGreek,
    mdiAtom,
    mdiBaguette,
    mdiBarley,
    mdiBasketball,
    mdiBio,
    mdiBookMusic,
    mdiBookOpenPageVariant,
    mdiBookshelf,
    mdiBottleTonicPlus,
    mdiBrain,
    mdiCalculatorVariant,
    mdiCameraBurst,
    mdiCashMultiple,
    mdiChartBellCurve,
    mdiCity,
    mdiCityVariant,
    mdiClipboardPulse,
    mdiCogs,
    mdiCommaCircleOutline,
    mdiCow,
    mdiCurrencyUsd,
    mdiDiamondStone,
    mdiDna,
    mdiDog,
    mdiDomain,
    mdiDramaMasks,
    mdiDraw,
    mdiEarth,
    mdiEgg,
    mdiFlag,
    mdiFlask,
    mdiFlaskRoundBottom,
    mdiFlower,
    mdiFood,
    mdiFoodApple,
    mdiFountainPenTip,
    mdiGesture,
    mdiGoogleClassroom,
    mdiGrass,
    mdiHammerWrench,
    mdiHandPeace,
    mdiHandshake,
    mdiHeadCog,
    mdiHeadSnowflake,
    mdiHeart,
    mdiTempleHindu,
    mdiHistory,
    mdiHome,
    mdiHomeCircleOutline,
    mdiHorse,
    mdiHospitalBox,
    mdiHospitalBuilding,
    mdiHuman,
    mdiHumanGreeting,
    mdiHumanGreetingProximity,
    mdiHumanMaleChild,
    mdiHumanQueue,
    mdiIdeogramCjk,
    mdiImageFilterHdr,
    mdiStarCrescent,
    mdiStarDavid,
    mdiLaptop,
    mdiLibrary,
    mdiMathIntegral,
    mdiMonitor,
    mdiMusicNote,
    mdiNewspaper,
    mdiPig,
    mdiPineTree,
    mdiPipeWrench,
    mdiPrescription,
    mdiResistor,
    mdiRocketLaunch,
    mdiSafetyGoggles,
    mdiSchool,
    mdiShape,
    mdiShield,
    mdiShieldAirplane,
    mdiShieldStar,
    mdiShopping,
    mdiSlopeUphill,
    mdiSolarPanel,
    mdiSprout,
    mdiStadiumVariant,
    mdiHumanMaleBoard,
    mdiTools,
    mdiTournament,
    mdiTranslate,
    mdiVirus,
    mdiVote,
    mdiWaterPump,
    mdiWaves,
    mdiWeightLifter,
    mdiWrench,
    mdiFish,
    mdiPizza,
    mdiPasta,
    mdiHamburger,
    mdiBlender,
    mdiFoodSteak,
    mdiRice,
    mdiFoodOff,
    mdiCoffee,
    mdiBowlMix,
    mdiWeatherNight,
    mdiFoodForkDrink
} from '@mdi/js';

/**
 * Retrieves a specialized icon for a given building.
 * 
 * @param building the building to get the icon for
 * @param classes [optional] the classes to add to the icon
 * @param size [optional] the size of the icon
 */
 export const getIconForBuilding = (building: ResolvableBuildingCode, classes = '', size = 16) => {
    switch (building) {
        case "ABL": return <MdiIcon path={mdiSprout} className={classes} size={`${size}px`} />;
        case "ACS": return <MdiIcon path={mdiShape} className={classes} size={`${size}px`} />;
        case "ACDS": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "ADC": return <MdiIcon path={mdiFountainPenTip} className={classes} size={`${size}px`} />;
        case "AES": return <MdiIcon path={mdiHammerWrench} className={classes} size={`${size}px`} />;
        case "APS": return <MdiIcon path={mdiCameraBurst} className={classes} size={`${size}px`} />;
        case "ARJ": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "ARTB": return <MdiIcon path={mdiDraw} className={classes} size={`${size}px`} />;
        case "ATWR": return <MdiIcon path={mdiDog} className={classes} size={`${size}px`} />;
        case "AUST": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "B1": return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "B3": return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "B4_A": return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "B5": return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "BCH": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "BISH": return <MdiIcon path={mdiCameraBurst} className={classes} size={`${size}px`} />;
        case "BOUS": return <MdiIcon path={mdiHeadSnowflake} className={classes} size={`${size}px`} />;
        case "BPB": return <MdiIcon path={mdiSafetyGoggles} className={classes} size={`${size}px`} />;
        case "BRON": return <MdiIcon path={mdiBio} className={classes} size={`${size}px`} />;
        case "BUSN": return <MdiIcon path={mdiAccountTie} className={classes} size={`${size}px`} />;
        case "C2E2": return <MdiIcon path={mdiSolarPanel} className={classes} size={`${size}px`} />;
        case "CAST": return <MdiIcon path={mdiHammerWrench} className={classes} size={`${size}px`} />;
        case "CHEM": return <MdiIcon path={mdiFlask} className={classes} size={`${size}px`} />;
        case "CISS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "CPB": return <MdiIcon path={mdiAccountTie} className={classes} size={`${size}px`} />;
        case "CRU": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "DODD": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "DRMU": return <MdiIcon path={mdiMusicNote} className={classes} size={`${size}px`} />;
        case "DWTN": return <MdiIcon path={mdiCityVariant} className={classes} size={`${size}px`} />;
        case "E2": return <MdiIcon path={mdiHammerWrench} className={classes} size={`${size}px`} />;
        case "ESB": return <MdiIcon path={mdiHammerWrench} className={classes} size={`${size}px`} />;
        case "FLC": return <MdiIcon path={mdiFlower} className={classes} size={`${size}px`} />;
        case "FSB": return <MdiIcon path={mdiHumanMaleChild} className={classes} size={`${size}px`} />;
        case "GAMP": return <MdiIcon path={mdiStadiumVariant} className={classes} size={`${size}px`} />;
        case "GENT": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "GP": return <MdiIcon path={mdiAtom} className={classes} size={`${size}px`} />;
        case "GRE": return <MdiIcon path={mdiTournament} className={classes} size={`${size}px`} />;
        case "GS": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "GUL": return <MdiIcon path={mdiDomain} className={classes} size={`${size}px`} />;
        case "GW": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "HALL": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "HAWL": return <MdiIcon path={mdiWeightLifter} className={classes} size={`${size}px`} />;
        case "HBL": return <MdiIcon path={mdiLibrary} className={classes} size={`${size}px`} />;
        case "HDC": return <MdiIcon path={mdiHumanQueue} className={classes} size={`${size}px`} />;
        case "HEW": return <MdiIcon path={mdiPrescription} className={classes} size={`${size}px`} />;
        case "HJT": return <MdiIcon path={mdiDramaMasks} className={classes} size={`${size}px`} />;
        case "HPL": return <MdiIcon path={mdiLibrary} className={classes} size={`${size}px`} />;
        case "HSSW": return <MdiIcon path={mdiAccountMultiple} className={classes} size={`${size}px`} />;
        case "HTB": return <MdiIcon path={mdiCity} className={classes} size={`${size}px`} />;
        case "HU1": return <MdiIcon path={mdiHorse} className={classes} size={`${size}px`} />;
        case "HU2": return <MdiIcon path={mdiHorse} className={classes} size={`${size}px`} />;
        case "IMS": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "IPB": return <MdiIcon path={mdiShield} className={classes} size={`${size}px`} />;
        case "ITE": return <MdiIcon path={mdiMonitor} className={classes} size={`${size}px`} />;
        case "JONS": return <MdiIcon path={mdiFoodApple} className={classes} size={`${size}px`} />;
        case "JRB": return <MdiIcon path={mdiBottleTonicPlus} className={classes} size={`${size}px`} />;
        case "KEL": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "KLIN": return <MdiIcon path={mdiSprout} className={classes} size={`${size}px`} />;
        case "KNS": return <MdiIcon path={mdiDna} className={classes} size={`${size}px`} />;
        case "LAFA": return <MdiIcon path={mdiHome} className={classes} size={`${size}px`} />;
        case "LSA": return <MdiIcon path={mdiDna} className={classes} size={`${size}px`} />;
        case "LOR": return <MdiIcon path={mdiHorse} className={classes} size={`${size}px`} />;
        case "LU1": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "LU2": return <MdiIcon path={mdiPig} className={classes} size={`${size}px`} />;
        case "MAN": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "MCHU": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "MONT": return <MdiIcon path={mdiCalculatorVariant} className={classes} size={`${size}px`} />;
        case "MUSB": return <MdiIcon path={mdiMusicNote} className={classes} size={`${size}px`} />;
        case "MLIB": return <MdiIcon path={mdiBookMusic} className={classes} size={`${size}px`} />;
        case "PBB": return <MdiIcon path={mdiPrescription} className={classes} size={`${size}px`} />;
        case "PCSB": return <MdiIcon path={mdiHumanGreetingProximity} className={classes} size={`${size}px`} />;
        case "PR": return <MdiIcon path={mdiFood} className={classes} size={`${size}px`} />;
        case "PU1": return <MdiIcon path={mdiEgg} className={classes} size={`${size}px`} />;
        case "PWE": return <MdiIcon path={mdiHammerWrench} className={classes} size={`${size}px`} />;
        case "RHBA": return <MdiIcon path={mdiSprout} className={classes} size={`${size}px`} />;
        case "ROWE": return <MdiIcon path={mdiAccountQuestion} className={classes} size={`${size}px`} />;
        case "SCI1": return <MdiIcon path={mdiRocketLaunch} className={classes} size={`${size}px`} />;
        case "SCHN": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "SHA": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "SHH": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "SPRH": return <MdiIcon path={mdiHome} className={classes} size={`${size}px`} />;
        case "SRH": return <MdiIcon path={mdiHome} className={classes} size={`${size}px`} />;
        case "STRS": return <MdiIcon path={mdiClipboardPulse} className={classes} size={`${size}px`} />;
        case "STRSWW": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "SU": return <MdiIcon path={mdiSchool} className={classes} size={`${size}px`} />;
        case "TAB": return <MdiIcon path={mdiLaptop} className={classes} size={`${size}px`} />;
        case "TLS": return <MdiIcon path={mdiDna} className={classes} size={`${size}px`} />;
        case "TSK": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "VARC": return <MdiIcon path={mdiDraw} className={classes} size={`${size}px`} />;
        case "VDM": return <MdiIcon path={mdiMusicNote} className={classes} size={`${size}px`} />;
        case "WCB": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "WGC": return <MdiIcon path={mdiSchool} className={classes} size={`${size}px`} />;
        case "WITE": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "WH": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "WREC": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "WSH": return <MdiIcon path={mdiHeart} className={classes} size={`${size}px`} />;
        case "WSRH": return <MdiIcon path={mdiHome} className={classes} size={`${size}px`} />;
        case "WSRHA": return <MdiIcon path={mdiHome} className={classes} size={`${size}px`} />;
        case "WTBY": return <MdiIcon path={mdiCity} className={classes} size={`${size}px`} />;
        case "YNG": return <MdiIcon path={mdiSprout} className={classes} size={`${size}px`} />;
        default: return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
    }
}

export const getIconForCampus = (campus: AnySite, classes = '') => {
    switch (campus) {
        case 'all':
        case 'global': 
            return <i className={`fa fa-globe-americas fa-fw ${classes}`} />
        case 'unknown':
            return <i className={`fa fa-question-circle fa-fw ${classes}`} />
        case 'storrs': return <i className={`fas fa-school-flag fa-fw ${classes}`} />
        case 'avery_point': return <i className={`fas fa-umbrella-beach fa-fw ${classes}`} />
        case 'hartford': return <i className={`fas fa-landmark-dome fa-fw ${classes}`} />
        case 'stamford': return <i className={`fas fa-mountain-city fa-fw ${classes}`} />
        case 'waterbury': return <i className={`fas fa-building-flag fa-fw ${classes}`} />
    }
}

export const getIconForCourse = (course: string, classes = '', size = 16) => {
    let type = course.split(/\d/)[0].toUpperCase();
    switch (type) {
        case "AAAS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "ACCT": return <MdiIcon path={mdiAbacus} className={classes} size={`${size}px`} />;
        case "AFRA": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "AGNR": return <MdiIcon path={mdiSprout} className={classes} size={`${size}px`} />;
        case "AH":   return <MdiIcon path={mdiBottleTonicPlus} className={classes} size={`${size}px`} />;
        case "AIRF": return <MdiIcon path={mdiShieldAirplane} className={classes} size={`${size}px`} />;
        case "AMST": return <MdiIcon path={mdiFlag} className={classes} size={`${size}px`} />;
        case "ANSC": return <MdiIcon path={mdiHorse} className={classes} size={`${size}px`} />;
        case "ANTH": return <MdiIcon path={mdiAccountMultiple} className={classes} size={`${size}px`} />;
        case "ARAB": return <MdiIcon path={mdiStarCrescent} className={classes} size={`${size}px`} />;
        case "ARE":  return <MdiIcon path={mdiCashMultiple} className={classes} size={`${size}px`} />;
        case "ARIS": return <MdiIcon path={mdiStarCrescent} className={classes} size={`${size}px`} />;
        case "ART":  return <MdiIcon path={mdiGesture} className={classes} size={`${size}px`} />;
        case "ARTH": return <MdiIcon path={mdiGesture} className={classes} size={`${size}px`} />;
        case "ASLN": return <MdiIcon path={mdiHandPeace} className={classes} size={`${size}px`} />;
        case "BADM": return <MdiIcon path={mdiHandshake} className={classes} size={`${size}px`} />;
        case "BIOL": return <MdiIcon path={mdiAtom} className={classes} size={`${size}px`} />;
        case "BLAW": return <MdiIcon path={mdiBookOpenPageVariant} className={classes} size={`${size}px`} />;
        
        // Placeholder
        case "BME":  return <MdiIcon path={mdiBio} className={classes} size={`${size}px`} />;
        case "BUSN": return <MdiIcon path={mdiDomain} className={classes} size={`${size}px`} />;
        case "CAMS": return <MdiIcon path={mdiAlphabetGreek} className={classes} size={`${size}px`} />;
        case "CE":   return <MdiIcon path={mdiWrench} className={classes} size={`${size}px`} />;
        case "CHEG": return <MdiIcon path={mdiFlask} className={classes} size={`${size}px`} />;
        case "CHEM": return <MdiIcon path={mdiFlask} className={classes} size={`${size}px`} />;
        case "CHIN": return <MdiIcon path={mdiIdeogramCjk} className={classes} size={`${size}px`} />;
        case "CLCS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "COGS": return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "COMM": return <MdiIcon path={mdiAccountVoice} className={classes} size={`${size}px`} />;
        case "CRLP": return <MdiIcon path={mdiTranslate} className={classes} size={`${size}px`} />;
        case "CSE":  return <MdiIcon path={mdiLaptop} className={classes} size={`${size}px`} />;
        case "DGS":  return <MdiIcon path={mdiDna} className={classes} size={`${size}px`} />;
        case "DIET": return <MdiIcon path={mdiFood} className={classes} size={`${size}px`} />;
        case "DMD":  return <MdiIcon path={mdiFountainPenTip} className={classes} size={`${size}px`} />;
        case "DRAM": return <MdiIcon path={mdiDramaMasks} className={classes} size={`${size}px`} />;
        case "ECE":  return <MdiIcon path={mdiResistor} className={classes} size={`${size}px`} />;
        case "ECON": return <MdiIcon path={mdiCurrencyUsd} className={classes} size={`${size}px`} />;
        case "EDCI": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "EDLR": return <MdiIcon path={mdiFoodApple} className={classes} size={`${size}px`} />;
        case "EEB":  return <MdiIcon path={mdiHomeCircleOutline} className={classes} size={`${size}px`} />;
        case "EGEN": return <MdiIcon path={mdiHumanMaleBoard} className={classes} size={`${size}px`} />;
        case "ENGL": return <MdiIcon path={mdiBookshelf} className={classes} size={`${size}px`} />;
        case "ENGR": return <MdiIcon path={mdiPipeWrench} className={classes} size={`${size}px`} />;
        case "ENVE": return <MdiIcon path={mdiPineTree} className={classes} size={`${size}px`} />;
        case "ENVS": return <MdiIcon path={mdiPineTree} className={classes} size={`${size}px`} />;
        case "EPSY": return <MdiIcon path={mdiHeadCog} className={classes} size={`${size}px`} />;
        case "ES":   return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "EVST": return <MdiIcon path={mdiPineTree} className={classes} size={`${size}px`} />;
        case "FINA": return <MdiIcon path={mdiMusicNote} className={classes} size={`${size}px`} />;
        case "FNCE": return <MdiIcon path={mdiCurrencyUsd} className={classes} size={`${size}px`} />;
        case "FREN": return <MdiIcon path={mdiBaguette} className={classes} size={`${size}px`} />;
        case "GEOG": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "GERM": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "GPS":  return <MdiIcon path={mdiSchool} className={classes} size={`${size}px`} />;
        case "GSCI": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "HCMI": return <MdiIcon path={mdiHospitalBuilding} className={classes} size={`${size}px`} />;
        case "HDFS": return <MdiIcon path={mdiHumanMaleChild} className={classes} size={`${size}px`} />;
        case "HEJS": return <MdiIcon path={mdiStarDavid} className={classes} size={`${size}px`} />;
        case "HIND": return <MdiIcon path={mdiTempleHindu} className={classes} size={`${size}px`} />;
        case "HIST": return <MdiIcon path={mdiHistory} className={classes} size={`${size}px`} />;
        case "HRTS": return <MdiIcon path={mdiHuman} className={classes} size={`${size}px`} />;
        case "ILCS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "INDS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "INTD": return <MdiIcon path={mdiCityVariant} className={classes} size={`${size}px`} />;
        case "IRIS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "JAPN": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "JOUR": return <MdiIcon path={mdiNewspaper} className={classes} size={`${size}px`} />;
        case "KINS": return <MdiIcon path={mdiBasketball} className={classes} size={`${size}px`} />;
        case "KORE": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "LAND": return <MdiIcon path={mdiImageFilterHdr} className={classes} size={`${size}px`} />;
        case "LING": return <MdiIcon path={mdiCommaCircleOutline} className={classes} size={`${size}px`} />;
        case "LLAS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "MARN": return <MdiIcon path={mdiWaves} className={classes} size={`${size}px`} />;
        case "MAST": return <MdiIcon path={mdiWaves} className={classes} size={`${size}px`} />;
        case "MATH": return <MdiIcon path={mdiMathIntegral} className={classes} size={`${size}px`} />;
        case "MCB":  return <MdiIcon path={mdiDna} className={classes} size={`${size}px`} />;
        case "ME":   return <MdiIcon path={mdiTools} className={classes} size={`${size}px`} />;
        case "MEM":  return <MdiIcon path={mdiCogs} className={classes} size={`${size}px`} />;
        case "MGMT": return <MdiIcon path={mdiHandshake} className={classes} size={`${size}px`} />;
        case "MGRK": return <MdiIcon path={mdiAlphabetGreek} className={classes} size={`${size}px`} />;
        case "MISI": return <MdiIcon path={mdiShieldStar} className={classes} size={`${size}px`} />;
        case "MKTG": return <MdiIcon path={mdiShopping} className={classes} size={`${size}px`} />;
        case "MLSC": return <MdiIcon path={mdiFlaskRoundBottom} className={classes} size={`${size}px`} />;
        case "MSE":  return <MdiIcon path={mdiDiamondStone} className={classes} size={`${size}px`} />;
        case "MUSI": return <MdiIcon path={mdiMusicNote} className={classes} size={`${size}px`} />;
        case "NRE":  return <MdiIcon path={mdiPineTree} className={classes} size={`${size}px`} />;
        case "NURS": return <MdiIcon path={mdiHospitalBox} className={classes} size={`${size}px`} />;
        case "NUSC": return <MdiIcon path={mdiFood} className={classes} size={`${size}px`} />;
        case "OPIM": return <MdiIcon path={mdiLaptop} className={classes} size={`${size}px`} />;
        case "OSH":  return <MdiIcon path={mdiBottleTonicPlus} className={classes} size={`${size}px`} />;
        case "PERS": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "PHAR": return <MdiIcon path={mdiPrescription} className={classes} size={`${size}px`} />;
        case "PHIL": return <MdiIcon path={mdiHuman} className={classes} size={`${size}px`} />;
        case "PHRX": return <MdiIcon path={mdiPrescription} className={classes} size={`${size}px`} />;
        case "PHYS": return <MdiIcon path={mdiSlopeUphill} className={classes} size={`${size}px`} />;
        case "PNB":  return <MdiIcon path={mdiBrain} className={classes} size={`${size}px`} />;
        case "POLS": return <MdiIcon path={mdiVote} className={classes} size={`${size}px`} />;
        case "PORT": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "PP":   return <MdiIcon path={mdiVote} className={classes} size={`${size}px`} />;
        case "PSYC": return <MdiIcon path={mdiHeadCog} className={classes} size={`${size}px`} />;
        case "PUBH": return <MdiIcon path={mdiBottleTonicPlus} className={classes} size={`${size}px`} />;
        case "PVS":  return <MdiIcon path={mdiVirus} className={classes} size={`${size}px`} />;
        case "SAAG": return <MdiIcon path={mdiBarley} className={classes} size={`${size}px`} />;
        case "SAAS": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "SANR": return <MdiIcon path={mdiPineTree} className={classes} size={`${size}px`} />;
        case "SAPB": return <MdiIcon path={mdiCow} className={classes} size={`${size}px`} />;
        case "SAPL": return <MdiIcon path={mdiFlower} className={classes} size={`${size}px`} />;
        case "SARE": return <MdiIcon path={mdiWaterPump} className={classes} size={`${size}px`} />;
        case "SLHS": return <MdiIcon path={mdiHeadCog} className={classes} size={`${size}px`} />;
        case "SOCI": return <MdiIcon path={mdiHumanQueue} className={classes} size={`${size}px`} />;
        case "SOWK": return <MdiIcon path={mdiHumanGreeting} className={classes} size={`${size}px`} />;
        case "SPAN": return <MdiIcon path={mdiEarth} className={classes} size={`${size}px`} />;
        case "SPSS": return <MdiIcon path={mdiGrass} className={classes} size={`${size}px`} />;
        case "STAT": return <MdiIcon path={mdiChartBellCurve} className={classes} size={`${size}px`} />;
        case "TRST": return <MdiIcon path={mdiTranslate} className={classes} size={`${size}px`} />;
        case "UNIV": return <MdiIcon path={mdiSchool} className={classes} size={`${size}px`} />;
        case "URBN": return <MdiIcon path={mdiCityVariant} className={classes} size={`${size}px`} />;
        case "WGSS": return <MdiIcon path={mdiHuman} className={classes} size={`${size}px`} />;
        default:     return <MdiIcon path={mdiGoogleClassroom} className={classes} size={`${size}px`} />;
    }
}

/**
 * Returns the specialized icon for a given dining hall type, if it has one.
 * 
 * @param hall the dining hall type to get the icon for
 * @param classes [optional] the classes to add to the icon
 * @param size    [optional] the size of the icon
 */
export const getIconForDiningHall = (hall: keyof typeof DiningHallType, classes = '', size = 16) => {
    switch (hall) {
        case 'BUCKLEY': return <MdiIcon path={mdiFish} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'MCMAHON': return <MdiIcon path={mdiPizza} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'NORTH': return <MdiIcon path={mdiPasta} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'NORTHWEST': return <MdiIcon path={mdiHamburger} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'PUTNAM': return <MdiIcon path={mdiBlender} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'SOUTH': return <MdiIcon path={mdiFoodSteak} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'TOWERS': return <MdiIcon path={mdiFood} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'WHITNEY': return <MdiIcon path={mdiRice} className={`fa-fw ${classes}`} size={`${size}px`} />;
        default: return <MdiIcon path={mdiFood} className={`fa-fw ${classes}`} size={`${size}px`} />;
    }
}

/**
 * Returns the specialized icon for a given dining hall status type, if it has one.
 * 
 * @param hall the dining hall type to get the icon for
 * @param classes [optional] the classes to add to the icon
 * @param size    [optional] the size of the icon
 */
export const getIconForDiningStatus = (status: keyof typeof DiningHallStatus, classes = '', size = 16) => {
    switch (status.toUpperCase().replace(/\s/g, '_')) {
        case 'BETWEEN_MEALS':
        case 'CLOSED':
            return <MdiIcon path={mdiFoodOff} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'BREAKFAST': return <MdiIcon path={mdiCoffee} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'BRUNCH': return <MdiIcon path={mdiBowlMix} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'DINNER': return <MdiIcon path={mdiFoodSteak} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'LATE_NIGHT': return <MdiIcon path={mdiWeatherNight} className={`fa-fw ${classes}`} size={`${size}px`} />;
        case 'LUNCH': return <MdiIcon path={mdiFoodForkDrink} className={`fa-fw ${classes}`} size={`${size}px`} />;
        default: <MdiIcon path={mdiFoodOff} className={`fa-fw ${classes}`} size={`${size}px`} />;
    }
}