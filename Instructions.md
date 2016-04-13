# Message Broker Test Project

## Overview

Create a simple message broker (queueing system) with a HTTP based RESTful API.

The message broker needs to guarantee that messages published to the queue will
be eventually delivered to all registered consumers.  This means that:

- If there is more than one consumer of a queue, the message will be delivered
  to all consumers.
- If a consumer cannot be reached, the broker must retry sending until it can
  be delivered.

There is no strict requirements for technology used for the project, though
node.js is preferred.


## RESTful API Spec

Optional endpoints will be marked with "Optional" in their title.

### Queue management

#### GET /queues (Optional)

Return the list of queues.

*Parameters:*

None.

*Returns:*

The list of queues:

```
[{
    id: "<queue_id>",
    name: "<queue name>"
}]
```

#### POST /queues (Optional)

Create a new queue.

*Parameters:*

- *name*: new queue name

*Returns:*

New queue id and status:

```
{
    status: "ok",
    id: "<queue_id>"
}
```

#### PUT /queues/:id (Optional)

Modify an existing queue.

*Parameters:*

- *name*: new queue name

*Returns:*

Status object:

```
{ status: "ok" }
```

#### DELETE /queues/:id (Optional)

Delete an existing queue.

*Parameters:*

None.

*Returns:*

Status object:

```
{ status: "ok" }
```

### Publish messages

#### POST /queues/:id/messages

Sends new message to all registered consumers of a queue.

*Parameters:*

- *body*: message body (text)

*Returns:*

Status object:

```
{ status: "ok" }
```


### Consume messages

#### POST /queues/:id/consumers

Registers a new consumer on a queue.

*Parameters:*

- *callback_url*: URL for receiving messages. When a new message is published, the broker sends a POST with:
    - *id*: unique message ID
    - *timestamp*: shows when message was published
    - *body*: message body

*Returns:*

Status and ID of newly-created queue:

```
{
    status: "ok",
    queue_id: "<queue_id>"
}
```

#### GET /queues/:id/consumers

Return the list of consumers for a queue.

*Parameters:*

None.

*Returns:*

List of consumers:

```
[{
    id: "<consumer_id>",
    queue_id: "<queue_id>",
    callback_url: "<URL for getting messages>"
}]
```

#### DELETE /queues/:id/consumers/:consumer_id (Optional)

Delete an existing consumer.

*Parameters:*

None.

*Returns:*

Status object:

```
{ status: "ok" }
```

### Errors

Return errors using the following convention:

```
{
    status: "error",
    error: "<error description>"
}
```


## Deliverables

This project requires the following components to be created:

- Message broker server with described API
- Sample message publisher
- Sample message consumer


## Evaluation

We evaluate:

- Functionality: Does your project work to the specification?
- Code Quality: Is your code well thought out and straightforward?
- Implementation: Is the implementation well-suited to the problem?
- Choices made: In the case of undefined behaviour in the spec, what choices
  did you make as to behaviour and why?

We understand that you have a limited time to complete the project, so you will
need to make tradeoffs and possibly do things in a way that you wouldn't if
this was production code.  You should therefore be prepared to discuss:

- The design of your project
- Why you made the choices you did
- What tradeoffs you made and why
- What you would do to turn this into production-ready code

We really like:

- A good README that tells us how to get started
- Mentioning the discussion points above in your README
- Good, readable tests

Use 3rd-party code at your discretion.  The intention of this project is to
show off your coding ability, not to prove you can write wrappers around
3rd-party systems.  This means that we prefer you use 3rd-party code to help
you get things done faster, but not to implement the business logic of the
project.  In node.js using [Express](http://expressjs.com/) would be an example
of a good 3rd-party package to include (since writing an HTTP server from
scratch is not part of the project).  Creating a small wrapper around
[RabbitMQ](https://www.rabbitmq.com/) would be bad, since RabbitMQ implements
nearly all of the business logic for the project.