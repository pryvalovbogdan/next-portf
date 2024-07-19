interface Resources {
  footer: {
    description: 'This is a non-page component that requires its own namespace';
    helpLocize: 'With using <1>locize</1> you directly support the future of <3>i18next</3>.';
    languageSwitcher: 'Switch from <str>{{lng}}</str> to: ';
  };
  'second-client-page': {
    'back-to-home': 'Back to home';
    h1: 'A second client page, to demonstrate client side i18n';
    title: 'Second client page';
  };
  'second-page': {
    'back-to-home': 'Back to home';
    h1: 'A second page, to demonstrate routing';
    title: 'Second page';
  };
  translation: {
    titleLayout: 'A simple example';
    descriptionLayout: 'Home';
    'to-client-page': 'To client page';
    'to-second-page': 'To second page';
  };
}

export default Resources;
