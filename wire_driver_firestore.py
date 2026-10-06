with open("src/app/driver/page.tsx", "r") as f:
    code = f.read()

# Add submission handler function
submit_fn = """  // Submit Inspection to Google Cloud Firestore
  const [submittingCheck, setSubmittingCheck] = useState(false);
  const [submissionCert, setSubmissionCert] = useState<string | null>(null);

  const submitInspectionToCloud = async () => {
    setSubmittingCheck(true);
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleReg,
          trailerId: selectedTrailer === 'CUSTOM' ? customTrailer : selectedTrailer,
          trailerHeight: fleetTrailers.find(t => t.id === selectedTrailer)?.height || '4.45m',
          defectsLogged,
          driverName: 'Driver Alex K.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionCert(data.record.digitalSignature);
        setIsCheckComplete(true);
      }
    } catch (err) {
      console.error('Failed to submit inspection:', err);
    } finally {
      setSubmittingCheck(false);
    }
  };
"""

if "const submitInspectionToCloud =" not in code:
    code = code.replace("const [defectsLogged, setDefectsLogged] = useState(0);", "const [defectsLogged, setDefectsLogged] = useState(0);\n" + submit_fn)

# Replace the complete check trigger with our cloud submission
code = code.replace("setIsCheckComplete(true);", "submitInspectionToCloud();")

with open("src/app/driver/page.tsx", "w") as f:
    f.write(code)

print("✓ Driver In-Cab OS successfully wired to Cloud Firestore API!")
