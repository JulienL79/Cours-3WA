import dayjs from 'dayjs'
import 'dayjs/locale/fr.js'

dayjs.locale('fr')

/**
 * Vérifie et formate une date au format 'YYYY-MM-DD'
 * @param {string} dateStr 
 * @returns {string|null} Une date formatée ou null si invalide
 */
export const normalizeDate = (dateStr) => {
    const date = dayjs(dateStr)
    return date.isValid() ? date.format('YYYY-MM-DD') : null
}

/**
 * Formate une date vers un affichage français lisible : "12 mars 2001"
 * @param {string} dateStr 
 * @returns {string} Exemple : "14 février 1995"
 */

export const formatDateFr = (dateStr) => {
    const date = dayjs(dateStr)
    return date.isValid() ? date.format('D MMMM YYYY') : 'Date invalide'
}
