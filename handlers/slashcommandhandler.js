module.exports = {
    check_mod(role) {
        return role.name === 'OSP' || role.name === 'Team Leaders' ||
               role.name === 'Archivists' || role.name === 'Keepers';
    },
    check_team_lead(role) {
        return role.name === 'OSP' || role.name === 'Team Leaders';
    }
}