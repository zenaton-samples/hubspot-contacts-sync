// user = {
//   email: "",
//   firstname: "",
//   lastname: "",
//   phone: ""
// }

const { duration } = require("zenaton");

module.exports.handle = function*(user) {
  const hubspotIntegrationId = yield this.run.task("GetEnv", "ZENATON_HUBSPOT_INTEGRATION_ID");

  const hubspot = this.connector("hubspot", hubspotIntegrationId);

  // create contact in hubspot
  const hubspotUser = yield hubspot.post(`/contacts/v1/contact/`, {
    body: {
      properties: [
        {
          property: "email",
          value: user.email
        },
        {
          property: "firstname",
          value: user.firstname
        },
        {
          property: "lastname",
          value: user.lastname
        },
        {
          property: "phone",
          value: user.phone
        }
      ]
    }
  });

  // wait until the user starts the process
  yield this.wait.event("start_process").forever();

  // wait at most 20 minutes for the user th complete the process
  const event = yield this.wait.event("complete_process").for(duration.minutes(20));

  // if no event was received, mark the user as "User in trouble"
  if (!event) {
    yield hubspot.post(`/contacts/v1/contact/email/${user.email}/profile`, {
      body: {
        properties: [
          {
            property: "became_a_user_in_trouble_date",
            value: this.date().setHours(0, 0, 0, 0).valueOf()
          }
        ]
      }
    });
  }
}
