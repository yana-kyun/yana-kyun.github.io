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

let globalProfileFormInstance;

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
  console.log("ProfileForm init() called. Current selectedCountryIso:", this.selectedCountryIso);
  console.log("Phone before updatePhoneMask:", this.phone);
  console.log("PhoneMask before updatePhoneMask:", this.phoneMask); // <-- Добавьте
  this.updatePhoneMask();
  console.log("Phone after updatePhoneMask in init:", this.phone);
  console.log("PhoneMask after updatePhoneMask in init:", this.phoneMask); // <-- Добавьте
  globalProfileFormInstance = this;
  window.globalProfileFormInstance = globalProfileFormInstance;
  console.log("globalProfileFormInstance set and assigned to window");
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
  console.log("updatePhoneMask: About to check selectedCountryIso. Current profileForm.selectedCountryIso:", this.selectedCountryIso);
  const countryData = countriesMasks.find(c => c.iso === this.selectedCountryIso);
  console.log("Found countryData for iso:", this.selectedCountryIso, ", data:", countryData); // <-- Новый лог
  if (countryData) {
    this.phoneMask = countryData.mask;
    console.log("updatePhoneMask: JUST SET phoneMask to:", this.phoneMask);
    this.phonePlaceholder = this.getPlaceholderForMask(countryData.mask);
    this.formatPhoneInput();
    console.log("After formatPhoneInput, phoneMask is:", this.phoneMask); // <-- Новый лог
  } else {
    this.phoneMask = ""; 
    console.log("updatePhoneMask: SET phoneMask to empty string"); // <-- Новый лог
    this.phonePlaceholder = "";
    console.log("Setting phoneMask to empty string"); // <-- Новый лог
  }
},
  
  formatPhoneInput() {
  console.log("formatPhoneInput called. Current phoneMask:", this.phoneMask, "Current phone:", this.phone); // <-- Новый лог
  // Если маска не установлена, очищаем всё, что не цифра
  if (!this.phoneMask) {
    this.phone = this.phone.replace(/\D/g, '');
    console.log("formatPhoneInput: phoneMask was empty, phone cleaned to:", this.phone); // <-- Новый лог
    return;
  }

  // Убираем все не-цифры
  let cleanPhone = this.phone.replace(/\D/g, '');

  // Получаем количество цифр, которое нужно по маске
  const maskDigits = this.phoneMask.replace(/\D/g, '').length;

  // Обрезаем до нужного количества цифр, если введено больше
  if (cleanPhone.length > maskDigits) {
    cleanPhone = cleanPhone.substring(0, maskDigits);
  }

  // Если цифр меньше, чем нужно по маске, не форматируем, просто оставляем как есть
  if (cleanPhone.length < maskDigits) {
    this.phone = cleanPhone;
    console.log("formatPhoneInput: phone has less digits than mask, phone set to:", this.phone); // <-- Новый лог
    return;
  }

  // Форматируем, если количество цифр совпадает
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

  // Присваиваем отформатированное значение
  this.phone = maskedPhone;
  console.log("formatPhoneInput: phone formatted to:", this.phone); // <-- Новый лог
},

  handlePhoneInput(event) {
    const currentMask = this.phoneMask; // <-- Сохраняем значение
    console.log("handlePhoneInput: 1. Current phoneMask (stored in variable):", currentMask, "Type:", typeof currentMask, "Raw:", JSON.stringify(currentMask));
    console.log("handlePhoneInput: 1. Current phoneMask (direct read):", this.phoneMask, "Type:", typeof this.phoneMask, "Raw:", JSON.stringify(this.phoneMask));

    let maskDigits = 0;
    let cleanValue = '';

    if (typeof currentMask === 'string') { // <-- Работаем с сохранённым значением
        const afterReplace = currentMask.replace(/\D/g, '');
        console.log("handlePhoneInput: phoneMask after replace (from stored variable):", JSON.stringify(afterReplace));
        console.log("handlePhoneInput: length after replace (from stored variable):", afterReplace.length);
        maskDigits = afterReplace.length;
        console.log("handlePhoneInput: maskDigits calculated as (from stored variable):", maskDigits);
    } else {
        console.error("handlePhoneInput: phoneMask (stored in variable) is not a string!", currentMask);
        console.log("handlePhoneInput: maskDigits calculated as (not string):", maskDigits);
    }

    let inputValue = event.target.value;
    cleanValue = inputValue.replace(/\D/g, '');
    console.log("handlePhoneInput: cleanValue after replace:", cleanValue);

    if (currentMask && cleanValue.length > maskDigits) { // <-- Работаем с сохранённым значением
        cleanValue = cleanValue.substring(0, maskDigits);
    }
    console.log("cleanValue after potential substring:", cleanValue);

    console.log("Setting this.phone to cleanValue:", cleanValue);
    this.phone = cleanValue;
    console.log("After setting, this.phone is:", this.phone);

    this.formatPhoneInput();
    console.log("After formatPhoneInput, this.phone is:", this.phone);

},

  onCountryChange(selectedIso) {
    console.log("onCountryChange called with:", selectedIso); // <-- Новый лог
    this.selectedCountryIso = selectedIso;
    console.log("this.selectedCountryIso set to:", this.selectedCountryIso); // <-- Новый лог
    const country = countriesMasks.find(c => c.iso === selectedIso);
    this.country = country ? country.name : "Турция";
    this.city = "";
    this.updatePhoneMask();
    console.log("updatePhoneMask called, current phoneMask:", this.phoneMask); // <-- Новый лог
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
    console.log("saveProfile called. Current phone value:", this.phone);
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
    alert("Изменения отменены.");
  },

  logout() {
    alert("Вы вышли из профиля.");
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
  console.log("Alpine started");
} else {
  console.log("Alpine was already started, skipping Alpine.start()");
}