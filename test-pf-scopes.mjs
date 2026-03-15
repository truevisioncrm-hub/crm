import { getAccessToken } from './src/lib/propertyfinder.ts';

async function testPFCreateScope() {
    try {
        const token = await getAccessToken();
        console.log("Token acquired.");

        // Decode JWT payload (it's the middle part of the token, base64url encoded)
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));

        console.log("JWT Payload:");
        console.log(JSON.stringify(payload, null, 2));

        if (payload.scope) {
            console.log("Scopes:", payload.scope);
            if (payload.scope.includes('listings:full_access')) {
                console.log("✅ API key HAS listings:full_access scope!");
            } else {
                console.log("❌ API key DOES NOT HAVE listings:full_access scope.");
            }
        } else if (payload.scopes) {
            console.log("Scopes:", payload.scopes);
        } else {
            console.log("No scopes found in JWT payload.");
        }

    } catch (err) {
        console.error("Authentication failed:", err.message);
    }
}

testPFCreateScope();
