const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    icon: path.join(__dirname, 'public', 'assets', 'icon'),
    asar: {
      unpack: '**/node_modules/@prisma/client/runtime/*.node'
    },
    extraResource: [
      path.join(__dirname, 'node_modules', '.prisma', 'client'),
      path.join(__dirname, 'prisma', 'migrations'),
      path.join(__dirname, 'node_modules', '@prisma', 'engines')
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://raw.githubusercontent.com/Pinkieseb/fintracker/main/public/assets/logo.png',
        setupIcon: path.join(__dirname, 'public', 'assets', 'logo.png')
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: path.join(__dirname, 'public', 'assets', 'logo.png'),
          maintainer: 'Pinkieseb',
          homepage: 'https://pinkieseb.com'
        }
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Pinkieseb',
          name: 'fintracker'
        },
        prerelease: false,
        draft: true
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          {
            entry: 'src/main.ts',
            config: 'vite.config.ts',
          },
          {
            entry: 'src/preload.ts',
            config: 'vite.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.config.ts',
          },
        ],
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};