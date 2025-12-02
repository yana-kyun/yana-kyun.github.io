import './css/styles.css';

import Alpine from 'alpinejs';

const countriesMasks = [
  {
    "name": "Russia",
    "code": "+7",
    "iso": "RU",
    "mask": "(###)###-##-##"
  },
  {
    "name": "Belarus",  
    "code": "+375",  
    "iso": "BY",  
    "mask": "(##)###-##-##"
  }
];

const citiesByCountry = {
  RU: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону"],
  BY: ["Минск", "Гомель", "Могилев", "Витебск", "Гродно", "Брест"]
};

window.Alpine = Alpine;

Alpine.data('profileForm', () => ({
  firstName: "Федор",
  lastName: "Семенов",
  phone: "",
  country: "", 
  selectedCountryIso: "", 
  city: "",
  selectedCity: "",
  clubName: "Karaoke Empire",
  clubAddress: "",
  clubSite: "karaoke-empire.com",
  email: "zanzak17@gmail.com",

  isPhotoUploaded: false,
  isPressed: false,

  errors: {},

  phoneMask: "",
  phonePlaceholder: "",

  init() {
  this.updatePhoneMask();
},

  handlePhotoClick() {
    this.isPressed = true;
    setTimeout(() => {
      this.isPhotoUploaded = !this.isPhotoUploaded;
      this.isPressed = false;
    }, 300);
  },

  handlePhotoMouseUp() {
    this.isPressed = false;
  },

  handlePhotoMouseLeave() {
    this.isPressed = false;
  },

  getPlaceholderForMask(mask) {
    if (!mask) return '';
    return mask.replace(/#/g, 'X');
  },

  updatePhoneMask() {
    const countryData = countriesMasks.find(c => c.iso === this.selectedCountryIso);
    if (countryData) {
      this.phoneMask = countryData.mask;
      this.phonePlaceholder = this.getPlaceholderForMask(countryData.mask);
      this.formatPhoneInput();
    } else {
      this.phoneMask = ""; 
      this.phonePlaceholder = "";
    }
  },
  
  formatPhoneInput() {
    if (!this.phoneMask) {
      this.phone = this.phone.replace(/\D/g, '');
      return;
    }
    let cleanPhone = this.phone.replace(/\D/g, '');
    const maskDigits = this.phoneMask.replace(/\D/g, '').length;
  
    if (cleanPhone.length > maskDigits) {
      cleanPhone = cleanPhone.substring(0, maskDigits);
    }

    if (cleanPhone.length < maskDigits) {
      this.phone = cleanPhone;
      return;
    }

    let maskedPhone = '';
    let phoneIndex = 0;

    for (let i = 0; i < this.phoneMask.length; i++) {
      if (phoneIndex >= cleanPhone.length) break;
  
      if (this.phoneMask[i] === '#') {
        maskedPhone += cleanPhone[phoneIndex];
        phoneIndex++;
      } else {
        maskedPhone += this.phoneMask[i];
      }
    }

    this.phone = maskedPhone;
  },

  handlePhoneInput(event) {
    const currentMask = this.phoneMask;
    let maskDigits = 0;
    let cleanValue = '';

    if (typeof currentMask === 'string') { 
        const afterReplace = currentMask.replace(/\D/g, '');
        maskDigits = afterReplace.length;
    } else {
        console.error("handlePhoneInput: phoneMask (stored in variable) is not a string!", currentMask);
    }

    let inputValue = event.target.value;
    cleanValue = inputValue.replace(/\D/g, '');

    if (currentMask && cleanValue.length > maskDigits) { 
        cleanValue = cleanValue.substring(0, maskDigits);
    }
    this.phone = cleanValue;
    this.formatPhoneInput();
  },

  onCountryChange(selectedIso) {
    this.selectedCountryIso = selectedIso;
    const country = countriesMasks.find(c => c.iso === selectedIso);
    this.country = country ? country.name : "Турция";
    this.city = "";
    this.updatePhoneMask();
  },

  onCityChange(selectedCity) {
    this.city = selectedCity;
  },

  getCityOptions() {
    return citiesByCountry[this.selectedCountryIso] || [];
  },

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  validatePhone(phone) {
    if (!this.phoneMask) return false; 
    if (!phone || phone.trim() === '') {
        return false;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const maskDigits = this.phoneMask.replace(/\D/g, '').length;
    return cleanPhone.length === maskDigits;
  },

  validateForm() {
    this.errors = {};
    if (!this.firstName.trim()) {
      this.errors.firstName = "Имя обязательно";
    }
    if (!this.lastName.trim()) {
      this.errors.lastName = "Фамилия обязательна";
    }
    if (!this.validatePhone(this.phone)) {
      this.errors.phone = "Неверный формат телефона";
    }
    if (!this.validateEmail(this.email)) {
      this.errors.email = "Неверный формат email";
    }
    if (!this.selectedCountryIso) {
      this.errors.country = "Страна обязательна";
    }
    if (this.selectedCountryIso && this.getCityOptions().length > 0 && !this.city) {
      this.errors.city = "Город обязателен";
    }
    if (!this.clubName.trim()) {
      this.errors.clubName = "Название заведения обязательно";
    }
    if(!this.clubAddress.trim()) {
      this.errors.clubAddress = "Адрес заведения обязателен";
    }
    if (!this.clubSite.trim()) {
      this.errors.clubSite = "Сайт заведения обязателен";
    }

    return Object.keys(this.errors).length === 0;
  },

  saveProfile() {
    if (this.validateForm()) {
      console.log("Данные сохранены:", {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        country: this.country,
        selectedCountryIso: this.selectedCountryIso,
        city: this.city,
        clubName: this.clubName,
        clubAddress: this.clubAddress,
        clubSite: this.clubSite,
        email: this.email
      });
      alert("Данные успешно сохранены!");
    } else {
      console.log("Ошибки валидации:", this.errors);
    }
  },

  cancel() {
    alert("Изменения отменены");
  },

  logout() {
    alert("Вы вышли из профиля");
  },
}));

Alpine.data('dropdown', (options = [], selectedValue = null, onSelection = null) => ({
  options: options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt), 
  selected: selectedValue,
  onSelection: onSelection,

  isOpen: false,
  searchQuery: '',

  get filteredOptions() {
    if (!this.searchQuery.trim()) {
      return this.options;
    }
    const query = this.searchQuery.toLowerCase();
    return this.options.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  },

  get displayText() {
    if (!this.selected) return 'Выберите страну';
    const option = this.options.find(opt => opt.value === this.selected);
    return option ? option.label : 'Выберите страну';
  },

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    }
  },

  select(option) {
    this.selected = option.value;
    this.isOpen = false;
    this.searchQuery = '';
    if (this.onSelection) {
      this.onSelection(option.value);
    }
  },

  close() {
    this.isOpen = false;
    this.searchQuery = '';
  },
}));


if (!window.alpineStarted) {
  Alpine.start();
  window.alpineStarted = true;
} else {
  console.log("Alpine was already started");
}