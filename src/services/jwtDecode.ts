import { JwtTokenDTO } from "../dto/mod";

export const jwtDecode = (token: string) => {
  try {
    const splitedToken = token.split(".");
    if (splitedToken.length !== 3) throw new Error();

    const encodedPayload = splitedToken[1];

    const payload: JwtTokenDTO = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString("utf8"),
    );

    return payload;
  } catch (_) {
    throw new Error("401");
  }
};
