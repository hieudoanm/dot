import { render } from '@testing-library/react';
import { DownloadsTemplate } from '../DownloadsTemplate';

describe('DownloadsTemplate', () => {
  it('to match snapshot', () => {
    const { container } = render(
      <DownloadsTemplate
        cli=""
        macos={{
          app: '',
          dmg: '',
        }}
        ubuntu={{
          appImage: '',
          deb: '',
        }}
        windows={{
          exe: '',
          msi: '',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
