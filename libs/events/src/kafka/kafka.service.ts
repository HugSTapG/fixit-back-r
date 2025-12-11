import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(KafkaService.name);
    private readonly kafka: Kafka;
    private readonly producer: Producer;
    private readonly consumers: Map<string, Consumer> = new Map();

    constructor(private readonly configService: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.configService.get('KAFKA_CLIENT_ID', 'fixit-api-gateway'),
            brokers: [this.configService.get('KAFKA_BROKERS', 'localhost:9092')],
            retry: {
                initialRetryTime: 100,
                retries: 8,
            },
        });

        this.producer = this.kafka.producer({
            maxInFlightRequests: 1,
            idempotent: true,
            transactionTimeout: 30000,
        });
    }

    async onModuleInit() {
        try {
            await this.producer.connect();
            this.logger.log('Kafka producer connected successfully');
        } catch (error) {
            this.logger.error('Failed to connect Kafka producer:', error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.producer.disconnect();

            for (const [groupId, consumer] of this.consumers) {
                await consumer.disconnect();
                this.logger.log(`Consumer ${groupId} disconnected`);
            }

            this.logger.log('Kafka connections closed');
        } catch (error) {
            this.logger.error('Error disconnecting Kafka:', error);
        }
    }

    async publishEvent(topic: string, message: any, key?: string) {
        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        key,
                        value: JSON.stringify(message),
                        timestamp: Date.now().toString(),
                        headers: {
                            source: 'api-gateway',
                            eventType: topic,
                        },
                    },
                ],
            });

            this.logger.debug(`Event published to topic ${topic}:`, message);
        } catch (error) {
            this.logger.error(`Failed to publish event to topic ${topic}:`, error);
            throw error;
        }
    }

    async subscribeToTopic(
        topic: string,
        groupId: string,
        callback: (message: KafkaMessage) => Promise<void>
    ) {
        try {
            const consumer = this.kafka.consumer({ groupId });
            await consumer.connect();
            await consumer.subscribe({ topic });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        await callback(message);
                        this.logger.debug(`Message processed from topic ${topic}, partition ${partition}`);
                    } catch (error) {
                        this.logger.error(`Error processing message from topic ${topic}:`, error);
                    }
                },
            });

            this.consumers.set(groupId, consumer);
            this.logger.log(`Subscribed to topic ${topic} with group ${groupId}`);
        } catch (error) {
            this.logger.error(`Failed to subscribe to topic ${topic}:`, error);
            throw error;
        }
    }
}
