const path = require('path');
const {buildExternal, packer, webpack} = require('lerna-packer');

const apps = {
    demo: {
        root: path.resolve(__dirname, 'packages', 'demo'),
        template: path.resolve(__dirname, 'packages', 'demo/public/index.html'),
        publicPath: path.resolve(__dirname, 'packages', 'demo/public'),// dev-server
        port: 3000,
        main: path.resolve(__dirname, 'packages', 'demo/src/index.js'),
        dist: path.resolve(__dirname, 'dist', 'demo'),
        servedPath: '/',// todo: make package.json homepage dependent,
        vendors: [],
        plugins: [],
    },
};

const backends = {
    flowDoodleStorage: {
        root: path.resolve(__dirname, 'packages', 'flow-doodle-storage'),
        src: 'src',
        entry: 'server.js',
    },
};

const packages = {
    // the keys are the commonjs names that is applied to externals
    // this is the same as `@babel/plugin-transform-modules-commonjs` applies
    flowDoodleCore: {
        name: '@flow-doodle/core',
        root: path.resolve(__dirname, 'packages', 'flow-doodle-core'),
        entry: path.resolve(__dirname, 'packages', 'flow-doodle-core/src/'),
        externals: {
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
        },
    },
    flowDoodleMui: {
        name: '@flow-doodle/mui',
        root: path.resolve(__dirname, 'packages', 'flow-doodle-mui'),
        entry: path.resolve(__dirname, 'packages', 'flow-doodle-mui/src/'),
        externals: {
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
        },
    },
    flowDoodleReact: {
        name: '@flow-doodle/react',
        root: path.resolve(__dirname, 'packages', 'flow-doodle-react'),
        entry: path.resolve(__dirname, 'packages', 'flow-doodle-react/src/'),
        externals: {
            react: buildExternal('react'),
            'react-dom': buildExternal('react-dom'),
        },
    },
};

packer(
    {apps, backends, packages},
    __dirname,
);
