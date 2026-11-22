import { app } from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` 🛡️  DATHEON APPSEC & API PENTESTING TESTBED RUNNING ON PORT ${PORT}`);
  console.log(` 👤 Student: Yadish Kumar | Application ID: DT-2026-7ZENR`);
  console.log(` 🔓 Vulnerable API: http://localhost:${PORT}/api/v1/dashboard?appId=DT-2026-001`);
  console.log(` 🔒 Hardened API:   http://localhost:${PORT}/api/v2/dashboard/DT-2026-7ZENR`);
  console.log(` 🌐 Public Verify:  http://localhost:${PORT}/api/v2/public/verify/DT-2026-7ZENR`);
  console.log(`================================================================`);
});
