const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    icon: path.join(__dirname, 'public', 'assets', 'icon'),
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://raw.githubusercontent.com/your-repo/main/public/assets/icon.ico',
        setupIcon: path.join(__dirname, 'public', 'assets', 'icon.ico')
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
          icon: path.join(__dirname, 'public', 'assets', 'icon.png'),
          maintainer: 'Pinkieseb',
          homepage: 'https://pinkieseb.com'
        }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: path.join(__dirname, 'public', 'assets', 'icon.png')
        }
      },
    },
    {
      name: '@electron-forge/maker-flatpak',
      config: {
        options: {
          icon: path.join(__dirname, 'public', 'assets', 'icon.png'),
          categories: ['Finance'],
          mimeType: ['application/x-pinkieseb']
        }
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'yourusername',
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