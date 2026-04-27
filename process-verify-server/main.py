# main.py - process-verify wrapper server
# Deploy on: 143.110.242.221:8080
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

VERIFY_URLS = {
    "demo": "https://blue-dlrgen.goflipo.com/api/verify-sms",
    "production": "https://dlr-gen.goflipo.com/api/verify-sms",
}


@app.route("/process-verify", methods=["POST"])
def process_verify():
    try:
        data = request.json
        logger.info(f"Received data: {data}")

        environment = data.get("environment", "demo")
        verify_url = VERIFY_URLS.get(environment, VERIFY_URLS["demo"])
        logger.info(f"Environment: {environment} → Verify URL: {verify_url}")

        verify_payload = {
            "authcode": data.get("authcode"),
            "senderid": data.get("senderid"),
            "pe_id": data.get("pe_id"),
            "number": data.get("number"),
            "content_id": data.get("content_id"),
            "encoding_type": "8",
            "message_hex": data.get("message_hex"),
        }

        logger.info(f"Sending payload to {verify_url}: {verify_payload}")

        verify_response = requests.post(
            verify_url,
            headers={"Content-Type": "application/json"},
            json=verify_payload,
            timeout=30,
        )

        logger.info(f"Response status: {verify_response.status_code}")
        logger.info(f"Response content: {verify_response.text}")

        if verify_response.status_code != 200:
            logger.error(f"API returned status {verify_response.status_code}")
            return jsonify(
                {
                    "error": f"API returned status {verify_response.status_code}",
                    "response": verify_response.text,
                }
            ), 500

        if not verify_response.text.strip():
            logger.error("Empty response from API")
            return jsonify({"error": "Empty response from API"}), 500

        try:
            response_data = verify_response.json()
            logger.info(f"Parsed JSON response: {response_data}")
            return jsonify(response_data)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return jsonify(
                {
                    "error": "Invalid JSON response from API",
                    "response": verify_response.text,
                }
            ), 500

    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {e}")
        return jsonify({"error": f"Request failed: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
