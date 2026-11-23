/* NB Holdings Partnership — lead delivery
 *
 * Every website form sends its lead to HubSpot (one HubSpot form per funnel
 * path). If HubSpot can't be reached, the same lead goes to Formspree instead,
 * so no inquiry is lost.
 */
(function () {
  "use strict";

  var PORTAL_ID = "248103393";
  var HUBSPOT_FORMS = {
    business: "ff01a446-f86b-477d-aaff-0d13df039610",   // Business Idea Leads
    realestate: "ed4e257e-ee8a-4a2b-a0b5-013a78dcf6ce", // Real Estate Leads
    investor: "73625a22-853f-47e3-adef-7960cedf0499"    // Investor Inquiries
  };
  var FALLBACK_ENDPOINT = "https://formspree.io/f/xdegzwky";

  function toHubSpot(formKey, props) {
    var fields = Object.keys(props)
      .filter(function (k) { return props[k] !== undefined && props[k] !== null && props[k] !== ""; })
      .map(function (k) { return { objectTypeId: "0-1", name: k, value: String(props[k]) }; });
    var url = "https://api.hsforms.com/submissions/v3/integration/submit/" +
      PORTAL_ID + "/" + HUBSPOT_FORMS[formKey];
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: fields,
        context: { pageUri: window.location.href, pageName: document.title }
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("HubSpot " + res.status);
    });
  }

  function toFormspree(fallbackData) {
    return fetch(FALLBACK_ENDPOINT, {
      method: "POST",
      body: fallbackData,
      headers: { Accept: "application/json" }
    }).then(function (res) {
      if (!res.ok) throw new Error("Formspree " + res.status);
    });
  }

  /**
   * formKey: "business" | "realestate" | "investor"
   * props: HubSpot contact properties, e.g. { firstname, email, nb_lead_category, ... }
   * fallbackData: FormData sent to Formspree only if HubSpot fails
   */
  window.NBLeads = {
    send: function (formKey, props, fallbackData) {
      return toHubSpot(formKey, props).catch(function () {
        return toFormspree(fallbackData);
      });
    }
  };
})();
