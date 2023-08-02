// secretKeysService.ts

import SecretKeys from "../../src/model/SecretKeys";

// secretKeys ------------------------------------------------------------------------------------>
export const secretKeys = (secretKeysParam: any) => {
  return SecretKeys.findOne({secretKeys: secretKeysParam});
};
