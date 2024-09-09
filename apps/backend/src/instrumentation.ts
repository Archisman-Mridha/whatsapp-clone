import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql"
import { BatchSpanProcessor, NodeTracerProvider, SpanExporter } from "@opentelemetry/sdk-trace-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-otlp-grpc"
import { Resource } from "@opentelemetry/resources"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"

// Initializes traces and metrics exporting.
export function initInstrumentations(traceExporterURL: string) {
  const traceExporter = new OTLPTraceExporter({
    url: traceExporterURL
  })

  const tracerProvider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "backend"
    })
  })
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter as SpanExporter))
  tracerProvider.register()

  registerInstrumentations({
    instrumentations: [new GraphQLInstrumentation()],

    tracerProvider
  })
}
