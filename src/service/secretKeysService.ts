// secretKeysService.ts
import SecretKeys from "../model/SecretKeys";

// secretKeys ------------------------------------------------------------------------------------>
export const secretKeys = (secretKeysParam: any) => {
  return SecretKeys.findOne({secretKeys: secretKeysParam});
};
