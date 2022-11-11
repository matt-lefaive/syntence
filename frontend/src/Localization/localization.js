const localization = lang => {
    if (!['eng', 'fre'].includes(lang)) lang = 'eng';
    
    const text = {
        ADDITIONAL_OPTIONS: {
            eng: "Additional Options:",
            fre: "Paramètres additionnels:"
        },
        ADMIN: {
            eng: 'Admin',
            fre: 'Administrateur·rice'
        },
        CHOOSE_RECORDING: {
            eng: "Choose recording...",
            fre: "Choisir enregistrement..."
        },
        DISPLAY_LANGUAGE: {
            eng: "Display Language:",
            fre: "Langue d'affichage:"
        },
        ENGLISH: {
            eng: "English",
            fre: "Anglais"
        },
        FRENCH: {
            eng: "French",
            fre: "Français"
        },
        GLOSS: {
            eng: "Gloss",
            fre: "Note"
        },
        GLOSSER: {
            eng: "Glosser",
            fre: "Noteur·se"
        },
        GROUP: {
            eng: 'Group',
            fre: 'Groupe'
        },
        OJIBWE: {
            eng: "Ojibwe",
            fre: "Ojibwé"
        },
        SETTINGS: {
            eng: "Settings:",
            fre: "Paramètres:"
        },
        SHOW_GROUP: {
            eng: "Show Group",
            fre: "Montrer groupe"
        },
        SHOW_TRANSLATED_SENTENCES: {
            eng: "Show translated sentences",
            fre: "Montrer phrases traduites"
        },
        SOURCE: {
            eng: "Source",
            fre: "Source",
        },
        SUBMIT: {
            eng: "Submit",
            fre: "Soumettre"
        },
        SUBMITTING: {
            eng: "Submitting",
            fre: "En soumettant"
        },
        TARGET_LANGUAGE: {
            eng: "Target Language:",
            fre: "Langue cible:"
        },
        TRANSLATION: {
            eng: "Translation",
            fre: "Traduction"
        },
        TRANSLATOR: {
            eng: "Translator",
            fre: "Traducteur·rice"
        },
        UPDATE: {
            eng: "Update",
            fre: "Actualiser"
        },
        UPDATED_TRANSLATION: {
            eng: "Updated translation",
            fre: "Traduction actualisée"
        },
        UPDATING: {
            eng: "Updating",
            fre: "En actualisant"
        },
    }

    Object.keys(text).forEach(translation => text[translation] = text[translation][lang])
    
    return text;
}

export default localization;