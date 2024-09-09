import { NodeSDK } from "@opentelemetry/sdk-node"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Resource } from "@opentelemetry/resources"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { MAX_GRAPHQL_QUERY_COMPLEXITY } from "./graphql/plugins/query-complexity"
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base"
import { ChannelCredentials } from "@grpc/grpc-js"
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql"
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg"
import { KafkaJsInstrumentation } from "@opentelemetry/instrumentation-kafkajs"
import { IORedisInstrumentation } from "@opentelemetry/instrumentation-ioredis"
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core"
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify"
import { ElasticsearchInstrumentation } from "opentelemetry-instrumentation-elasticsearch"
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator
} from "@opentelemetry/core"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"

const traceExporter = new OTLPTraceExporter({
  compression: CompressionAlgorithm.GZIP,
  credentials: ChannelCredentials.createInsecure()
})

const tracerProvider = new NodeSDK({
  resource: Resource.default().merge(
    new Resource({
      [ATTR_SERVICE_NAME]: "whatsapp-clone"
    })
  ),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new NestInstrumentation(),
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new KafkaJsInstrumentation(),
    new ElasticsearchInstrumentation(),
    new IORedisInstrumentation(),
    new PgInstrumentation(),
    new GraphQLInstrumentation({ depth: MAX_GRAPHQL_QUERY_COMPLEXITY })
  ],
  spanProcessors: [new BatchSpanProcessor(traceExporter) as never],
  traceExporter,
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()]
  })
})

process.on("SIGTERM", async () => {
  await tracerProvider.shutdown()
})

tracerProvider.start()

export default tracerProvider
