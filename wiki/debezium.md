# Debezium

Debezium is a set of distributed services to capture changes in your databases so that your
applications can see those changes and respond to them. Debezium is built on top of Apache Kafka and
provides a set of Kafka Connect compatible connectors. Connectors record the history of data changes
in the DBMS by detecting changes as they occur, and streaming a record of each change event to a
Kafka topic. Consuming applications can then read the resulting event records from the Kafka topic.

The first time it connects to a PostgreSQL server or cluster, the connector takes a consistent
snapshot of all schemas. After that snapshot is complete, the connector continuously captures
row-level changes that insert, update, and delete database content and that were committed to a
PostgreSQL database.

The PostgreSQL connector contains two main parts that work together to read and process
database changes:

- A logical decoding output plug-in. You might need to install the output plug-in that you choose to
  use. You must configure a replication slot that uses your chosen output plug-in before running the
  PostgreSQL server. The plug-in can be one of the following:

  - `DECODERBUFS` - based on Protobuf and maintained by the Debezium community.

  - `PGOUTPUT` - the standard logical decoding output plug-in in PostgreSQL 10+. It is maintained by
    the PostgreSQL community, and used by PostgreSQL itself for logical replication. This plug-in is
    always present so no additional libraries need to be installed.

- Java code (the actual Kafka Connect connector) that reads the changes produced by the chosen
  logical decoding output plug-in. It uses PostgreSQL’s streaming replication protocol by means of
  the PostgreSQL JDBC driver.
