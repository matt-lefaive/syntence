const localization = lang => {
    if (!['eng', 'fre'].includes(lang)) lang = 'eng';
    
    const text = {
        SETTINGS: {
            eng: "Settings:",
            fre: "Paramètres:"
        },
        DISPLAY_LANGUAGE: {
            eng: "Display Language:",
            fre: "Langue d'affichage:"
        },
        TARGET_LANGUAGE: {
            eng: "Target Language:",
            fre: "Langue cible:"
        },
        ENGLISH: {
            eng: "English",
            fre: "Anglais"
        },
        FRENCH: {
            eng: "French",
            fre: "Français"
        },
        OJIBWE: {
            eng: "Ojibwe",
            fre: "Ojibwé"
        },
        ADDITIONAL_OPTIONS: {
            eng: "Additional Options:",
            fre: "Paramètres additionnels:"
        },
        SHOW_TRANSLATED_SENTENCES: {
            eng: "Show translated sentences",
            fre: "Montrer phrases traduites"
        },
        CHOOSE_RECORDING: {
            eng: "Choose recording...",
            fre: "Choisir enregistrement..."
        },
        SUBMIT: {
            eng: "Submit",
            fre: "Soumettre"
        },
        SUBMITTING: {
            eng: "Submitting",
            fre: "En soumettant"
        },
        UPDATE: {
            eng: "Update",
            fre: "Actualiser"
        },
        UPDATING: {
            eng: "Updating",
            fre: "En actualisant"
        },
        TRANSLATION: {
            eng: "Translation",
            fre: "Traduction"
        },
        UPDATED_TRANSLATION: {
            eng: "Updated translation",
            fre: "Traduction actualisée"
        },
        TRANSLATOR: {
            eng: "Translator",
            fre: "Traducteur·rice"
        },
        GLOSSER: {
            eng: "Glosser",
            fre: "Noteur·se"
        }
    }

    Object.keys(text).forEach(translation => text[translation] = text[translation][lang])
    
    return text;
}

export default localization;