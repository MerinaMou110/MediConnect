from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import google.generativeai as genai  # Google Gemini API

# Configure Gemini API Key
genai.configure(api_key=settings.GEMINI_API_KEY)

class ChatbotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_message = request.data.get("message")

        if not user_message:
            return Response({"error": "Message is required"}, status=400)

        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(user_message)

            # Example structured JSON response
            structured_response = {
                "query": user_message,
                "bot_response": response.text,  # Main chatbot response
                "suggestions": [
                    "Would you like to book an appointment?",
                    "Do you need more details about your symptoms?",
                    "Would you like to check possible medications?"
                ],
                "severity": "moderate",  # You can add logic to classify severity
                "next_steps": "Monitor symptoms for 24 hours. If worsens, consult a doctor."
            }

            return Response(structured_response)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
