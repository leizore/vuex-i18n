/* globals Vue */

// initialize the plugin object
var VuexI18nPlugin = {};

// render the given translation with placeholder replaced
var render = function render(translation, replacements = {}) {

	return translation.replace(/\{\w+\}/g, function(placeholder) {

		var key = placeholder.replace('{', '').replace('}', '');

		if (replacements[key] !== undefined) {
			return replacements[key];
		}

		// warn user that the placeholder has not been found
		console.group('Not all placeholder founds');
		console.warn('Text:', translation);
		console.warn('Placeholder:', placeholder);
		console.groupEnd();

		// return the original placeholder
		return placeholder;
	});

};

// internationalization plugin for vue js using vuex
VuexI18nPlugin.install = function install(Vue, store, moduleName = 'i18n') {

	// check if the plugin was correctly initialized
	if (store.state.hasOwnProperty(moduleName) === false) {
		console.error('i18n vuex module is not correctly initialized. Please check the module name:', moduleName);

		// always return the key if module is not initialized correctly
		Vue.prototype.$i18n = function(key) {
			return key;
		};

		Vue.prototype.$getLanguage = function() {
			return null;
		};

		Vue.prototype.$setLanguage = function() {
			console.error('i18n vuex module is not correctly initialized');
		};

		return;
	};

	// get localized string from store
	Vue.prototype.$t = function $t(key, options) {

		// get the current language from the store
		var locale = store.state[moduleName].locale;

		// check if the language exists in the store. return the key if not
		if (store.state[moduleName].translations.hasOwnProperty(locale) === false ) {
			return render(key, options);
		}

		// check if the key exists in the store. return the key if not
		if (store.state[moduleName].translations[locale].hasOwnProperty(key) === false) {
			return render(key, options);
		}

		// return the value from the store
		return render(store.state[moduleName].translations[locale][key], options);
	};

	var setLocale = function setLocale(locale) {
		store.dispatch({
			type: 'setLocale',
			locale: locale
		});
	};

	var getLocale = function getLocale() {
		return store.state[moduleName].locale;
	};

	// add predefined translations to the store
	var addLocale = function addLocale(locale, translations) {
		return store.dispatch({
			type: 'addLocale',
			locale: locale,
			translations: translations
		});
	};

	Vue.prototype.$i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale
	};

	Vue.i18n = {
		locale: getLocale,
		set: setLocale,
		add: addLocale
	};

};

export default VuexI18nPlugin;