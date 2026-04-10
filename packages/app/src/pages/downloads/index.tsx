import { DownloadsTemplate } from '@dot/templates/DownloadsTemplate';
import { NextPage } from 'next';

const APP_NAME = 'dot';
const REPO = `https://github.com/hieudoanm/${APP_NAME}/releases/download`;
const VERSION = '0.0.1';

const DownloadsPage: NextPage = () => {
  return (
    <DownloadsTemplate
      cli={`${REPO}/cli-latest/${APP_NAME}`}
      macos={{
        app: `${REPO}/macos-latest/${APP_NAME}_${VERSION}_aarch64.app`,
        dmg: `${REPO}/macos-latest/${APP_NAME}_${VERSION}_aarch64.dmg`,
      }}
      ubuntu={{
        appImage: `${REPO}/ubuntu-latest/${APP_NAME}_${VERSION}_amd64.AppImage`,
        deb: `${REPO}/ubuntu-latest/${APP_NAME}_${VERSION}_amd64.deb`,
      }}
      windows={{
        exe: `${REPO}/windows-latest/${APP_NAME}_${VERSION}_x64-setup.exe`,
        msi: `${REPO}/windows-latest/${APP_NAME}_${VERSION}_x64_en-US.msi`,
      }}
    />
  );
};

export default DownloadsPage;
