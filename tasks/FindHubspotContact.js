module.exports.handle = async function(email) {
    const hubspot = this.connector("hubspot", process.env.ZENATON_HUBSPOT_INTEGRATION_ID);

    console.log(hubspot.get(`/contacts/v1/contact/email/${email}/profile`));
  };
