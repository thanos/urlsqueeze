/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [
    {from: '/static/*', to: 'static/*'},
    {from: '/', to: '_show/welcome'},
    {from: '/go/', to: '_show/go'},
    {from: '*', to: '_show/not_found'}
];
