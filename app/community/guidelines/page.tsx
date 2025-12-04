export default function CommunityGuidelines() {
  const guidelines = [
    {
      title: "Authenticity & Honesty",
      description:
        "Provide accurate information about your business. Don't misrepresent your products, services, or qualifications.",
      points: [
        "Use real photos of your business and services",
        "Accurately represent your business hours and contact information",
        "Don't create fake reviews or manipulate ratings",
      ],
    },
    {
      title: "Respectful Communication",
      description:
        "Treat everyone with respect, whether you're a business owner or customer.",
      points: [
        "No hate speech, discrimination, or harassment",
        "Provide constructive feedback, not personal attacks",
        "Respect privacy and don't share personal information",
      ],
    },
    {
      title: "Quality Reviews",
      description:
        "Write helpful, detailed reviews based on genuine experiences.",
      points: [
        "Share specific details about your experience",
        "Focus on facts rather than emotions",
        "Mention both positives and areas for improvement",
      ],
    },
    {
      title: "Business Standards",
      description: "Maintain high standards of service and transparency.",
      points: [
        "Respond to reviews professionally and promptly",
        "Address customer concerns fairly and transparently",
        "Honor commitments and appointments",
      ],
    },
    {
      title: "No Spam or Promotion",
      description: "TrustNet is for genuine reviews, not advertising.",
      points: [
        "Don't post promotional content as reviews",
        "No affiliate links or marketing messages",
        "Business owners shouldn't review their own businesses",
      ],
    },
    {
      title: "Legal Compliance",
      description: "All content must comply with applicable laws.",
      points: [
        "No illegal content or activities",
        "Respect intellectual property rights",
        "No false claims or defamatory statements",
      ],
    },
  ];

  const reportingSteps = [
    "Click the 'Report' button on the content in question",
    "Select the reason for reporting",
    "Provide any additional details if needed",
    "Submit your report for review",
  ];

  const consequences = [
    "Warning and content removal for minor violations",
    "Temporary suspension for repeated violations",
    "Permanent account termination for severe or repeated offenses",
    "Legal action for illegal activities",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TrustNet Community Guidelines
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These guidelines help maintain TrustNet as a trusted platform for
            discovering and reviewing local businesses. By using TrustNet, you
            agree to follow these guidelines.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              TrustNet exists to create a transparent and trustworthy ecosystem
              where:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Customers can find reliable local businesses</li>
              <li>Businesses can build genuine credibility</li>
              <li>Everyone can share honest experiences safely</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                These guidelines apply to all users, content, and interactions
                on TrustNet.
              </p>
            </div>
          </section>

          {/* Guidelines */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Community Guidelines
            </h2>
            <div className="space-y-8">
              {guidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-6 py-2"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {guideline.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{guideline.description}</p>
                  <ul className="space-y-1">
                    {guideline.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Reporting */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Reporting Violations
            </h2>
            <p className="text-gray-700 mb-4">
              If you see content that violates these guidelines, please report
              it:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <ol className="list-decimal pl-6 space-y-3">
                {reportingSteps.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Reports are reviewed by our moderation
                  team within 24-48 hours. We take all reports seriously and
                  investigate each case thoroughly.
                </p>
              </div>
            </div>
          </section>

          {/* Consequences */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Consequences for Violations
            </h2>
            <p className="text-gray-700 mb-4">
              Violations of these guidelines may result in:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consequences.map((consequence, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span className="text-red-800 font-medium">
                      {consequence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                <strong>Appeals:</strong> If you believe action was taken
                against your account in error, you may contact our support team
                at support@trustnet.com.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Questions or Concerns?
              </h3>
              <p className="mb-6">
                If you have questions about these guidelines or need
                clarification, please don't hesitate to reach out.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <a
                    href="mailto:support@trustnet.com"
                    className="text-blue-100 hover:text-white underline"
                  >
                    support@trustnet.com
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response Time</h4>
                  <p>Typically within 24-48 hours</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            TrustNet reserves the right to update these guidelines at any time.
            Continued use of the platform constitutes acceptance of any changes.
          </p>
        </div>
      </div>
    </div>
  );
}
