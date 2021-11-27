
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@flow-doodle/core': path.resolve(__dirname, './flow-doodle-core/src'),
'@flow-doodle/mui': path.resolve(__dirname, './flow-doodle-mui/src'),
'@flow-doodle/react': path.resolve(__dirname, './flow-doodle-react/src'),

        }
    }
}