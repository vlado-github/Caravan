export class DefaultConsts {
  public static readonly FirstPageIndex = 1;
  public static readonly RowsPerPage = 10;
  public static readonly LanguageStorageKey = 'caravan-lang';
  public static readonly SupportedLanguages = [ 
      { value: 'en', label: 'English', isDefault: true},
      { value: 'bs', label: 'Bosanski', isDefault: false},
      { value: 'sr', label: 'Srpski', isDefault: false},
      { value: 'hr', label: 'Hrvatski', isDefault: false},
  ];

  public static DefaultLanguage = DefaultConsts.SupportedLanguages.filter(lang => lang.isDefault)[0];
}