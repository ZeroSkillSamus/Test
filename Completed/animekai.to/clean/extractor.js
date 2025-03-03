export class AnimekaiDecoder {
  #reverseIt = (n) => {
    return n.split("").reverse().join("");
  };

  #base64UrlEncode = (str) => {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  #substitute = (input, keys, values) => {
    const map = Object.fromEntries(
      keys.split("").map((key, i) => [key, values[i] || ""])
    );
    return input
      .split("")
      .map((char) => map[char] || char)
      .join("");
  };

  #transform = (n, t) => {
    let v = Array.from({ length: 256 }, (_, i) => i),
      c = 0,
      f = "";

    for (let w = 0; w < 256; w++) {
      c = (c + v[w] + n.charCodeAt(w % n.length)) % 256;
      [v[w], v[c]] = [v[c], v[w]];
    }
    for (let a = (c = 0), w = 0; a < t.length; a++) {
      w = (w + 1) % 256;
      c = (c + v[w]) % 256;
      [v[w], v[c]] = [v[c], v[w]];
      f += String.fromCharCode(t.charCodeAt(a) ^ v[(v[w] + v[c]) % 256]);
    }

    return f;
  };

  #base64UrlDecode = (n) => {
    n = n
      .padEnd(n.length + ((4 - (n.length % 4)) % 4), "=")
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    return atob(n);
  };

  GenerateToken = (n) => {
    n = encodeURIComponent(n);
    return (n = this.#base64UrlEncode(
      this.#substitute(
        this.#base64UrlEncode(
          this.#transform(
            "sXmH96C4vhRrgi8",
            this.#reverseIt(
              this.#reverseIt(
                this.#base64UrlEncode(
                  this.#transform(
                    "kOCJnByYmfI",
                    this.#substitute(
                      this.#substitute(
                        this.#reverseIt(
                          this.#base64UrlEncode(
                            this.#transform("0DU8ksIVlFcia2", n)
                          )
                        ),
                        "1wctXeHqb2",
                        "1tecHq2Xbw"
                      ),
                      "48KbrZx1ml",
                      "Km8Zb4lxr1"
                    )
                  )
                )
              )
            )
          )
        ),
        "hTn79AMjduR5",
        "djn5uT7AMR9h"
      )
    ));
  };

  DecodeIframeData = (n) => {
    n = `${n}`;
    n = this.#transform(
      "0DU8ksIVlFcia2",
      this.#base64UrlDecode(
        this.#reverseIt(
          this.#substitute(
            this.#substitute(
              this.#transform(
                "kOCJnByYmfI",
                this.#base64UrlDecode(
                  this.#reverseIt(
                    this.#reverseIt(
                      this.#transform(
                        "sXmH96C4vhRrgi8",
                        this.#base64UrlDecode(
                          this.#substitute(
                            this.#base64UrlDecode(n),
                            "djn5uT7AMR9h",
                            "hTn79AMjduR5"
                          )
                        )
                      )
                    )
                  )
                )
              ),
              "Km8Zb4lxr1",
              "48KbrZx1ml"
            ),
            "1tecHq2Xbw",
            "1wctXeHqb2"
          )
        )
      )
    );
    return decodeURIComponent(n);
  };

  Decode = (n) => {
    n = this.#reverseIt(
      this.#substitute(
        this.#transform(
          "5ygxI8hjLiuDQ0",
          this.#base64UrlDecode(
            this.#transform(
              "z9cWnXuoDtx",
              this.#base64UrlDecode(
                this.#substitute(
                  this.#reverseIt(
                    this.#substitute(
                      this.#transform(
                        "EZnfG1IL6DF",
                        this.#base64UrlDecode(
                          this.#reverseIt(this.#base64UrlDecode((n = `${n}`)))
                        )
                      ),
                      "M2DCEbQmWOe",
                      "bEDCeOQ2mWM"
                    )
                  ),
                  "Lw7nfcTNz3FbWy",
                  "TFf37zywcNWnLb"
                )
              )
            )
          )
        ),
        "HK0TOgYzU1C",
        "T1CHYU0OKgz"
      )
    );

    return decodeURIComponent(n);
  };
}
// const { GenerateToken, DecodeIframeData, Decode } = new AnimekaiDecoder();

// console.log(GenerateToken("OID48ezyohKuiQ")); //S0pJWTdQcVl1c2NtRGgwbmluWHA5TGJXNFF1TzNtS1NsYjc
// console.log(
//   DecodeIframeData(
//     "RFpJYkxlZkZBNlpSRlpFeXYxUllmYldyODlWcTNHbmtscTdzQlNDZndVZmVoTFZXT2dVWFpIWVlsSEFkVDZ6WDZxY0o3ZFI0eGFhcEM2MnZJM2UyT1IwVTNfMVFVb3NQMVNWemtOMFdpMDFBWlpDNHM0amNyejYzX2RxUnJpTm15MEFLbi1WSGx1b19VcGc1VHY1eWQ4WXJsX2FXLVFNVTFmSHJpMTM4Q1V5RUVkc2NiTkxIUUZsUFBzaDRYRjJoNDZJSHdzZHgyMjJuS3F4NktwNkthbndWWTBuS2hWQkk5Um9mVERsNjBveDhPc3dPY1hGMmp2REpwaVJqc21HbDNkcDEyMlRMMWFkLUQ3NTJsTmIzVUdxT0ZKTDBJOS1EUEZBSjYtLVNLZl9ZWGdnQ1J5M3h6dzRESFZwUmVzeU41T0gya183bkFmbWF5NDBoZUlSQ1p2a1VvbHFralFya09KbWlwUlFDaFBuekxpdVNSaUEtVnNsUmVIdEc2YWxRZDFLU3I1VElxX3AyMXRPZ00yWkFoQ21iME9J"
//   )
// );
// console.log(
//   Decode(
//     "YXgwQnVZUVVQVjhwSVFfbnpmM21DZ2dUN2ItWE1TeUp5OUdINlBsb0lHX2FjWXJmS2JoVHlNakdOMF95U1pzbUtPb3VvRUNKeVNnT0VtTjZxSjZIbjlUYnBtUmlLd2VFb0pTNHJsTW1pOEtLa1luQmJfQWE3SjBxSldyalVuZTJWUUVkcnpTNWh4eGpBSkpTS1JLaGk4bi1NVmRYVlJHQmdCNzVVTVUyQ1RjbzF4a0dHU09ZNW9nalpIWV9jNWxmTjc3RW05S3JZd05iRWFoMVR2Z1p5NThjb3hSMm01bUZwTmVsUTlJR1BQcHVRUjJNZVZraDRramN2c0NSVGNPZ25QQnFzY3JKVEROQ3BVZFhhOWFTdFRsTjN3Q3EzakRaQnUxS2E3ZXA2d0VBZlk3TWMwWTdyQWxsVHZYSkx3cHBCMmJYNkRtRXRZd1FzelV2anJDQnFBcGtRS214aTRpd3doNnZVWGhJV1ZmTDhnaGdKVnVXc1BpTzVIQW9NcVcwYUtqaHpnNHBTbHJfVG9OV0VIVkp1NnhseklDTjZhdEN6bXh1Zl9jNEtyQ3BzbDcxN2R4QzZ3MHZMMWlKbXdLajZzWUtfdUQ3bVRsNU1iVUxVZlUtQTJEOUk3b3Fqamt2OUhfMnhqNk9PdjN0YjdYNzlhQ0NLR3lPVklkUDdTUnY5ZWotX0lWYXlsbG1sQU50M0c3TTVuQjZoUmZKaV9HQUlQdmJLVUVqXzZjcHJjazNFeTNtMFFXbk1sbWVzd1ZpUGkxU3diNHJBblpEbEdKcHEtSG5FT1FRVWloQ0xTbkN1MjBnMUtVQlVQZkdJcWhrZmtLelNxeVptSW1ZZmRQMWN3M1MzNWtpdjNlMUk0dHZXYXBYUXVFRVJpdE13OE1ZNGg0dFVRT3NSRXlILVFQSmYxWmxidUpsNmRxQkFNc095Q3N2S0xwNmhDZUl4dktMd2c1VUVxcHJORTNyY0lQenZXalBoMmF1ZFBDUDBVUjRUdF9Kbm1SMlQ0YkdoZWlIRjNGZVZHVG93U0NJQ1NocHp1MTVZM1ZoM3JnRVZ2RGVONGpiaTloeUlRZ1o1R1RUcWE2QXUxRFFrMGlNSEdCcmdIT1VQLWctbE55SmNpa05PbmgwWV9HbzI0RmxYS1I3SXl0b3dJTExjZzdPcjd1Y05kZ2tMMVE1Q0xDNHJKcmlPTjJWOGtySWNlV3o0anVwN0VRblpSRUM5VmJtT3BlSnYtMk5mdUIxVVoyOEJBTXFKOVFJWjd1Y09tbmdEWjVZekE3QjJlaGhYOWRDeTFnX0JGazE2RUJnVTJhaThTOFg3QV8wTF9WM0dteDRKeUVEMHBfa01ZLV82ZWVPalgwQzZxbE5OLTVUZ1d2b0FzNDZkcFk4cDBfa0kybHF1blJKdktQT2xMSVpFSW9IY0dfeVU5RVA2Xy1jYmVhQ1JrTXV0Z0xkbzIyOVFseUNqVkVRSXNzTnc5MUZyQUdUR3ZhOHg0Vk1JSGpWZHVjTFBoRmF2X0s3eGh2NURrWlRLM29MZURXZ1JaeTNkR0FHZGJzS2gxMU5uQnJ5S3dtdlBGN0Z0T1JFbnZkcGp6aWhSSS1tSnVnYnJDOHBKLTI5ODdncExGMVhEQ05SRERGTFRiTV9acXZfenpQM3JQMDJjd3B4LWUtcUY2NWV0MjhDQWstTkNDUE9DV1FhY2lKUWljXzBPWl9KcWxERG9WMlBNNU54R0tUZE1BYk9JZXlQbVBHVXpZR1hyRXUtWXpMSk1aMjJKMXhFS2pscTVmUERta0tMb0NSVGZfQVU1T1p4WEVqd25Kd21SUHJwNnI0S21WTkJSY01NaGp6Z1NyN0xtNmZNajNCYVFlbzZNV3NZU3Fmb2ZsQ1RjUEZXSTJudmdDWVBDRy1VNGxMYm5xOHFJLXU0Tmx4Rk14TF81MjdsWmZoVEUwa1dlS3NVLV9GOG9TTWdCR2E1LUkyWHpJcHJUU2FVM0hiaWI0NTUtVlczNkQ3WFVDTUxEeExOSGRGV215WnFUem5rcElVTFVsR3N4R0pQbXpXUS1rODgzR0k1MGJMSU91eHBETTZ3M01XVzBtNGt4UmlEN0ZTZnJ5ZjZ1QUhUZDVNY3JFeDItamdMVF85OVUzOHNDbWxQQ3Ezbk9ybDlRTFpacTlUZUFoTDNpbkZjc0I1dVpnZjBuWjFKakhFZ3BPSGpNOGd4eHlScGxtRFRZWVlVeXBzTWJWQXFNR2U5X3hTdGFWN2xWNm5wazF2ZWVPX01XdHdOTVFER2VFbHRJZmJTU1hIck9odEJaZkR3d3RvN1hELS1pTEttRWNBR2lrbFVzYnZSbEh1LTRNQzVrOEpwa3dWMVdBM0s0VXYyNGhHOUpRT2JNbnpEYXZaNnh6dlV6QlBVS051V1hiQi11UFNidWc"
//   )
// );
