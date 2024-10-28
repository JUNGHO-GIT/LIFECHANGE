// AuthPrivacy.tsx

import { Div, Hr } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const AuthPrivacy = () => {

  // 7. authPrivacyNode ----------------------------------------------------------------------------
  const authPrivacyNode = () => {
    // 1. privacy
    const privacySection = () => (
      <Grid container spacing={3} columns={12} className={"p-20"}>

        {/** 1. privacy */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Privacy Policy
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - This privacy policy applies to the LIFECHANGE app (hereby referred to as "Application") for mobile devices that was created by JUNGHO (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 2. information collection and use */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Information Collection and Use
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - The Application collects information when you download and use it. This information may include information such as:
            <ul>
              <li>Your device's Internet Protocol address (e.g. IP address)</li>
              <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
              <li>The time spent on the Application</li>
              <li>The operating system you use on your mobile device</li>
            </ul>
          </Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - The Application does not gather precise information about the location of your mobile device.</Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.</Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Email, age, etc. The information that the Service Provider request will be retained by them and used as described in this privacy policy.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 3. third party access */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Third Party Access
          </Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.
          </Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:
            <ul>
              <li>
                <a href="http://swww.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">
                  Google Play Services
                </a>
              </li>
              <li>
                <a href="http://ssupport.google.com/admob/answer/6128543?hl=en" target="_blank" rel="noopener noreferrer">
                  AdMob
                </a>
              </li>
            </ul>
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - The Service Provider may disclose User Provided and Automatically Collected Information:
            <ul>
              <li>
                as required by law, such as to comply with a subpoena, or similar legal process
              </li>
              <li>
                when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request
              </li>
              <li>
                with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.
              </li>
            </ul>
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 4. opt-out rights */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Opt-Out Rights
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 5. data retention policy */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Data Retention Policy
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at junghomun00@gmail.com and they will respond in a reasonable time.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 6. children */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Children
          </Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discover that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (junghomun00@gmail.com) so that they will be able to take the necessary actions.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 7. security */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Security
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 8. changes */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Changes
          </Div>
          <Div className={"fs-1-0rem fw-normal mb-20"}>
            - This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - This privacy policy is effective as of 2024-08-07
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 9. your consent */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Your Consent
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.
          </Div>
        </Grid>

        <Hr px={15} />

        {/** 10. contact us */}
        <Grid size={12}>
          <Div className={"fs-1-4rem fw-bolder mb-20"}>
            Contact Us
          </Div>
          <Div className={"fs-1-0rem fw-normal"}>
            - If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at junghomun00@gmail.com.
          </Div>
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min100vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {privacySection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {authPrivacyNode()}
    </>
  );
};