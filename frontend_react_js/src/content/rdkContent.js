/**
 * Local content model (no backend needed for MVP).
 * Kept intentionally structured so we can later load this from an API or markdown.
 */

const TOPIC_TYPES = {
  CONCEPT: "Concept",
  ARCH: "Architecture",
  RESPONSIBILITIES: "Responsibilities",
  PATTERNS: "Patterns",
  INTERVIEW: "Interview",
  GLOSSARY: "Glossary",
};

// PUBLIC_INTERFACE
export function getRdkTopics() {
  /** Returns the full list of topics used by the app. */
  return [
    {
      id: "what-is-rdk-middleware",
      type: TOPIC_TYPES.CONCEPT,
      title: "What is RDK & where middleware fits",
      description: "Big-picture explanation of RDK and the middleware layer.",
      sections: [
        {
          title: "The elevator pitch",
          body: [
            "RDK (Reference Design Kit) is a standardized software stack used by pay-TV and broadband device manufacturers to build set-top boxes and gateways faster.",
            "Middleware sits between applications (UIs, streaming apps, services) and the lower-level platform (drivers, OS, chipset SDKs).",
            "Its job is to provide stable, reusable APIs and services so apps don’t need to know device-specific details.",
          ],
        },
        {
          title: "Why it matters (interview framing)",
          body: [
            "Interviewers usually want to see you understand: abstraction boundaries, lifecycle, reliability, and how components communicate.",
            "A strong answer mentions: portability across hardware, consistent behavior, and isolating vendor/chipset differences.",
          ],
        },
      ],
      questions: [
        {
          id: "middleware-definition",
          category: "Core concepts",
          question: "What is middleware in an RDK environment?",
          shortAnswer:
            "A services/API layer that abstracts platform details and provides reusable capabilities to applications.",
          answer:
            "In an RDK environment, middleware is the layer that exposes stable APIs and shared services (e.g., media pipeline control, device settings, networking, telemetry, security, input) to applications while hiding OS/driver/chipset differences. It centralizes integration logic so apps can remain portable across device variants.",
          tags: ["abstraction", "apis", "services"],
        },
      ],
      glossary: [],
    },
    {
      id: "rdk-architecture-overview",
      type: TOPIC_TYPES.ARCH,
      title: "RDK architecture overview (high-level)",
      description: "How the stack is typically layered and how pieces talk.",
      sections: [
        {
          title: "Common layers (simplified mental model)",
          body: [
            "Applications/UI (operator UI, HTML5 apps, native apps)",
            "Middleware services (RDK services, frameworks, IPC, plugins)",
            "Platform/OS (Linux, system daemons, chipset SDK)",
            "Hardware (SoC, tuners, Wi‑Fi, HDMI, etc.)",
          ],
        },
        {
          title: "Communication patterns you’ll see",
          body: [
            "IPC between processes (e.g., message bus / RPC style calls)",
            "Plugin architectures so capabilities can be swapped or extended",
            "Service discovery and versioning to support evolution",
          ],
        },
      ],
      questions: [
        {
          id: "where-does-middleware-live",
          category: "Architecture",
          question: "Where does middleware sit in the RDK stack?",
          shortAnswer:
            "Between apps and the OS/platform, exposing stable services and APIs.",
          answer:
            "Middleware typically sits above OS/platform components and below applications. It provides the “contract” that apps depend on: stable APIs, shared services, and consistent behavior. It also integrates with system daemons and drivers via OS primitives and vendor SDKs.",
          tags: ["layers", "stack", "boundaries"],
        },
        {
          id: "how-components-talk",
          category: "Architecture",
          question: "How do middleware components communicate in modern RDK stacks?",
          shortAnswer:
            "Usually via IPC/RPC patterns, message buses, and service/plugin interfaces.",
          answer:
            "Because many components run as separate processes for isolation, middleware commonly uses IPC mechanisms (RPC frameworks, message buses, sockets) and service/plugin contracts. The goal is to decouple implementations from consumers while keeping performance and reliability acceptable.",
          tags: ["ipc", "rpc", "decoupling"],
        },
      ],
      glossary: [],
    },
    {
      id: "middleware-responsibilities",
      type: TOPIC_TYPES.RESPONSIBILITIES,
      title: "Middleware responsibilities",
      description: "What middleware actually does day-to-day on a device.",
      sections: [
        {
          title: "Core responsibilities",
          body: [
            "Abstraction: hide device-specific or vendor-specific details behind APIs.",
            "Integration: glue together OS, drivers, and higher-level services.",
            "Lifecycle: start/stop services, manage dependencies, handle updates.",
            "Reliability: monitoring, watchdog integration, graceful recovery.",
            "Security: secure storage, access control, privileged operations.",
          ],
        },
      ],
      questions: [
        {
          id: "why-abstraction-is-important",
          category: "Responsibilities",
          question: "Why is abstraction a key responsibility of middleware?",
          shortAnswer:
            "It reduces coupling so apps can work across devices and hardware variants.",
          answer:
            "Abstraction prevents applications from becoming tied to a specific chipset/driver/OS implementation. When hardware changes, you can update the middleware implementation while keeping the same API contract for applications—this improves portability, reduces regression risk, and speeds up delivery across product lines.",
          tags: ["abstraction", "portability"],
        },
        {
          id: "lifecycle-management",
          category: "Responsibilities",
          question: "What does lifecycle management mean in middleware?",
          shortAnswer:
            "Controlling startup/shutdown, dependencies, and health of services and components.",
          answer:
            "Lifecycle management includes orchestrating service initialization order, managing configuration, ensuring dependencies are available (network, storage, DRM), and handling failures (restarts, degraded modes). It’s also about clean shutdown and update/upgrade paths so devices remain stable in the field.",
          tags: ["lifecycle", "stability", "operations"],
        },
      ],
      glossary: [],
    },
    {
      id: "components-and-patterns",
      type: TOPIC_TYPES.PATTERNS,
      title: "Common components & patterns",
      description: "IPC, plugins, services, and practical design patterns.",
      sections: [
        {
          title: "IPC & service boundaries",
          body: [
            "Separate processes improve fault isolation and security boundaries.",
            "IPC/RPC allows apps/services to call across process boundaries.",
            "Good APIs are versioned, documented, and designed for compatibility.",
          ],
        },
        {
          title: "Plugin patterns",
          body: [
            "Plugins let you extend capabilities without recompiling everything.",
            "Common use: feature modules (e.g., device control, telemetry providers).",
          ],
        },
      ],
      questions: [
        {
          id: "ipc-why",
          category: "Patterns",
          question: "Why is IPC common in RDK middleware architectures?",
          shortAnswer:
            "To isolate failures/security and allow components to evolve independently.",
          answer:
            "IPC is common because components may run as separate services for reliability and security. If a media service crashes, you can restart it without taking down the UI. IPC also allows multiple apps to share the same capability through a controlled interface and supports incremental upgrades.",
          tags: ["ipc", "reliability", "security"],
        },
        {
          id: "plugin-benefit",
          category: "Patterns",
          question: "What’s the benefit of using plugins in middleware?",
          shortAnswer:
            "Extensibility and swap-ability: add/replace features behind a stable contract.",
          answer:
            "Plugins allow middleware to load optional capabilities or vendor-specific implementations behind a stable interface. This reduces the need to fork large codebases for device variants and makes it easier to test and deploy targeted changes.",
          tags: ["plugins", "extensibility"],
        },
      ],
      glossary: [],
    },
    {
      id: "interview-questions",
      type: TOPIC_TYPES.INTERVIEW,
      title: "Interview questions",
      description: "Curated Q/A cards for quick practice and deeper recall.",
      sections: [
        {
          title: "How to use this section",
          body: [
            "Use the search bar to filter by keyword (e.g., “IPC”, “lifecycle”, “abstraction”).",
            "Expand a question to see the full answer.",
            "Use “Copy answer” to paste into notes and practice rewriting in your own words.",
          ],
        },
      ],
      questions: [
        {
          id: "define-middleware",
          category: "Core concepts",
          question: "Define middleware (in one minute).",
          shortAnswer:
            "A reusable services layer that abstracts OS/hardware details for applications.",
          answer:
            "Middleware is the reusable services layer between applications and the OS/hardware. It abstracts device-specific implementation details and provides stable, documented APIs so applications can be portable, consistent, and easier to maintain as the platform evolves.",
          tags: ["definition", "abstraction"],
        },
        {
          id: "failure-isolation",
          category: "Reliability",
          question: "How does middleware improve reliability on embedded devices?",
          shortAnswer:
            "By centralizing health management, isolating components, and enabling controlled recovery.",
          answer:
            "Middleware improves reliability by running critical capabilities as managed services, monitoring health, integrating with watchdogs, and using process boundaries for fault isolation. When something fails, middleware can restart only the affected service, fall back to degraded behavior, and preserve a consistent API contract to apps.",
          tags: ["watchdog", "restarts", "fault-isolation"],
        },
        {
          id: "api-versioning",
          category: "Design",
          question: "How should middleware APIs be designed for long-lived devices?",
          shortAnswer:
            "Stable contracts, versioning, backward compatibility, and clear deprecation paths.",
          answer:
            "For long-lived devices, middleware APIs should be designed as contracts: well-documented behavior, explicit versioning, compatibility guarantees, and careful evolution. Additive changes are preferred; breaking changes require version bumps and a migration/deprecation strategy so existing apps remain functional.",
          tags: ["versioning", "compatibility", "contracts"],
        },
        {
          id: "security-boundary",
          category: "Security",
          question: "Why do we separate privileged operations into middleware services?",
          shortAnswer:
            "To enforce access control and reduce the attack surface exposed to apps.",
          answer:
            "Many device operations are privileged (DRM, network config, secure storage). Placing them in middleware services allows a controlled interface, authentication/authorization, auditing, and minimized exposure of sensitive implementation details to apps—reducing overall risk.",
          tags: ["security", "privilege", "access-control"],
        },
      ],
      glossary: [],
    },
    {
      id: "glossary",
      type: TOPIC_TYPES.GLOSSARY,
      title: "Glossary",
      description: "Quick definitions of terms you’ll hear in RDK discussions.",
      sections: [
        {
          title: "Key terms",
          body: [
            "Use this for quick recall during prep. Search also matches glossary.",
          ],
        },
      ],
      questions: [],
      glossary: [
        { term: "RDK", definition: "Reference Design Kit: standardized device software stack." },
        { term: "Middleware", definition: "Service/API layer between apps and OS/hardware." },
        { term: "IPC", definition: "Inter-process communication (RPC, message bus, sockets, etc.)." },
        { term: "Plugin", definition: "A module loaded behind an interface to extend/replace behavior." },
        { term: "Lifecycle", definition: "Startup/shutdown/health management of services and components." },
        { term: "Contract", definition: "API + behavior guarantee that consumers rely on over time." },
      ],
    },
  ];
}

// PUBLIC_INTERFACE
export function buildSearchIndex(topics) {
  /** Builds a normalized searchable string per topic. */
  return topics.map((t) => {
    const strings = [
      t.title,
      t.description,
      ...(t.sections || []).flatMap((s) => [s.title, ...(s.body || [])]),
      ...(t.questions || []).flatMap((q) => [
        q.category,
        q.question,
        q.shortAnswer,
        q.answer,
        ...(q.tags || []),
      ]),
      ...(t.glossary || []).flatMap((g) => [g.term, g.definition]),
    ];
    return {
      id: t.id,
      haystack: strings.filter(Boolean).join(" ").toLowerCase(),
    };
  });
}
