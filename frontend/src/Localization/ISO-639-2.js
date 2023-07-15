const ISO6392Codes = lang => {
    if (!lang) lang = 'eng';

    const codes = {
        ENG: {
            eng: 'English',
            fre: 'Anglais'   
        },
        FRE: {
            eng: 'French',
            fre: 'Français'
        },
        OJI: {
            eng: 'Ojibwe',
            fre: 'Ojibwé'
        },
        UMU: {
            eng: 'Munsee',
            fre: 'Munsee'
        },
        NYN: {
            eng: 'Kinyankole',
            fre: 'Kinyankole'
        },
        LUG: {
            eng: 'Luganda',
            fre: 'Luganda'
        },
        KIN: {
            eng: 'Kinyarwanda',
            fre: 'Kinyarwanda'
        },
        RUN: {
            eng: 'Kirundi',
            fre: 'Kirundi'
        },
        UNM: {
            eng: 'Unami',
            fre: 'Unami'
        }
    }

    Object.keys(codes).forEach(translation => codes[translation] = codes[translation][lang])

    return codes;
}

export default ISO6392Codes;