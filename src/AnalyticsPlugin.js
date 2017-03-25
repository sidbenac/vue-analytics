import { logDebug } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
  trackView (screenName) {
    logDebug('Dispatching TrackView', { screenName })

    ga('set', 'page', screenName)
    ga('send', 'pageview')
    ga('ec:addProduct', {               // Provide product details in an productFieldObject.
  'id': 'P12345',                   // Product ID (string).
  'name': 'Android Warhol T-Shirt', // Product name (string).
  'category': 'Apparel',            // Product category (string).
  'brand': 'Google',                // Product brand (string).
  'variant': 'black',               // Product variant (string).
  'price': '29.20',                 // Product price (currency).
  'quantity': 1                     // Product quantity (number).
});

// Add the step number and additional info about the checkout to the action.
ga('ec:setAction','checkout', {
    'step': 1,
    'option': 'Visa'
});
  }

  /**
   * Dispatch an analytics event
   *
   * @param category
   * @param action
   * @param label
   * @param value
   */
  trackEvent (category, action = null, label = null, value = null) {
    // TODO : FieldObject is full syntax, refactor this at one moment
    logDebug('Dispatching event', { category, action, label, value })

    ga('send', 'event', category, action, label, value)
   
   // (On "Next" button click)

ga('ec:setAction', 'purchase', {          // Transaction details are provided in an actionFieldObject.
  'id': 'T12345',                         // (Required) Transaction id (string).
  'affiliation': 'Google Store - Online', // Affiliation (string).
  'revenue': '42.39',                     // Revenue (currency).
  'tax': '2.85',                          // Tax (currency).
  'shipping': '5.34',                     // Shipping (currency).
  'coupon': 'SUMMER2013',
  'step':2                  // Transaction coupon (string).
});
ga('send', 'pageview');     // Send transaction data with initial pageview.

  }

  /**
   * Track an exception that occurred in the application.
   *
   * @param {string} description - Something describing the error (max. 150 Bytes)
   * @param {boolean} isFatal - Specifies whether the exception was fatal
   */
  trackException (description, isFatal = false) {
    ga('send', 'exception', { 'exDescription': description, 'exFatal': isFatal });
  }

  /**
   * Track an user timing to measure periods of time.
   *
   * @param {string} timingCategory - A string for categorizing all user timing variables into logical groups (e.g. 'JS Dependencies').
   * @param {string} timingVar -  A string to identify the variable being recorded (e.g. 'load').
   * @param {number} timingValue - The number of milliseconds in elapsed time to report to Google Analytics (e.g. 20).
   * @param {string|null} timingLabel -  A string that can be used to add flexibility in visualizing user timings in the reports (e.g. 'Google CDN').
   */
  trackTiming (timingCategory, timingVar, timingValue, timingLabel = null) {
    let conf = {
      hitType: 'timing',
      timingCategory,
      timingVar,
      timingValue
    }
    if (timingLabel) {
      conf.timingLabel = timingLabel;
    }

    logDebug('Dispatching timing', conf)
    ga('send', conf);
  }

  /**
   * Inject a new GlobalDimension that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} dimensionNumber
   * @param {string|int} value
   *
   * @throws Error - If already defined
   */
  injectGlobalDimension (dimensionNumber, value) {
    logDebug('Trying dimension Injection...', { dimensionNumber, value })

    // Test if dimension already registered
    if (pluginConfig.globalDimensions.find(el => el.dimension === dimensionNumber)) {
      throw new Error('VueAnalytics : Dimension already registered')
    }

    // Otherwise add dimension
    const newDimension = { dimension: dimensionNumber, value }

    pluginConfig.globalDimensions.push(newDimension)
    ga('set', `dimension${newDimension.dimension}`, newDimension.value)
    logDebug('Dimension injected')
  }

  /**
   * Inject a new GlobalMetric that will be sent every time.
   *
   * Prefer inject through plugin configuration.
   *
   * @param {int} metricNumber
   * @param {string|int} value
   *
   * @throws Error - If already defined
   */
  injectGlobalMetric (metricNumber, value) {
    logDebug('Trying metric Injection...', { metricNumber, value })

    // Test if dimension already registered
    if (pluginConfig.globalMetrics.find(el => el.metric === metricNumber)) {
      throw new Error('VueAnalytics : Metric already registered')
    }

    // Otherwise add dimension
    const newMetric = { metric: metricNumber, value }

    pluginConfig.globalMetrics.push(newMetric)
    ga('set', `metric${newMetric.metric}`, newMetric.value)
    logDebug('Metric injected')
  }

  /**
   * Set the current session language, use this if you change lang in the application after initialization.
   *
   * @param {string} code - Must be like in that : http://www.lingoes.net/en/translator/langcode.htm
   */
  changeSessionLanguage (code) {
    logDebug(`Changing application localisation & language to ${code}`);
    ga('set', 'language', code);
  }
}