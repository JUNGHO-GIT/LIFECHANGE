// secretKeysService.ts
import SecretKeys from "../schemas/SecretKeys";

// secretKeys ------------------------------------------------------------------------------------>
export const secretKeys = (secretKeysParam: any) => {
  return SecretKeys.findOne({secretKeys: secretKeysParam});
};
