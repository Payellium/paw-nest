interface SSLCommerzValidationResponse {
  status?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  currency?: string;
  bank_tran_id?: string;
  risk_level?: string;
  risk_title?: string;
}

export async function validateSSLCommerzPayment(
  validationId: string,
): Promise<SSLCommerzValidationResponse> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    throw new Error("Payment gateway credentials are missing.");
  }

  if (!validationId || validationId.length > 50) {
    throw new Error("Invalid payment validation ID.");
  }

  const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX === "true";

  const validationUrl = isSandbox
    ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

  const params = new URLSearchParams({
    val_id: validationId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const response = await fetch(`${validationUrl}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error("Payment verification service is unavailable.");
  }

  const data = (await response.json()) as SSLCommerzValidationResponse;

  return data;
}
