

Backend Team Leader Assignment
Design and Implement a Microservices Architecture


I would like to give a short explanation of a microservices architecture; this is a software development approach where an application is built as a collection of small, loosely coupled, independently deployable services. Each service typically handles a specific business function (like user authentication, product services, order services, or payment processing) and communicates with other services over lightweight protocols, such as HTTP or event-driven  messaging communication such as Kafka or rabitMQ.

For the sake of this modern e-commerce application, I am going to use a clean architectural design pattern. A modern application must be maintainable, scalable, testable, and fault-tolerant. This is why I ended up using the Clean Architectural Design approach.

Figure 1.
Let me break down each layer from the inside out:
Entities: These represent the core business objects and rules. They are the least likely to change when something external changes, such as the database or user interface.  The entity is often referred to as the "Model" layer in many architectural patterns, particularly in the context of MVC (Model-View-Controller) or similar patterns like Domain-Driven Design.

Figure 2


As seen in the screenshot of the product-service above. This is a typical entity as it has no dependencies on outer layers.
Use Cases: These contain application-specific business rules. They can also be called interactors, which orchestrate the flow of data between entities and the outer layers and direct those entities to use their critical business rules to achieve a goal.

Figure 3

Interface Adapters: This layer converts data from the format most convenient for the use cases and entities to the format most convenient for some external agency, such as the database or the Web. It contains three main components, which are controllers, presenters, and gateways, as seen in Figure 1 above. Below is the typical implementation of a controller.


Frameworks and Drivers: This is the outermost layer and includes tools like the database, web framework, the mobile application, and UI. This layer is where all the details go. The Web is a detail, and the database is a detail. We keep these things on the outside where they can do little harm.

 Microservices architecture for the e-commerce platform

The communication protocols that I will use are:
Synchronous: REST APIs for real-time interactions and http requests.
Asynchronous: Apache Kafka for event-driven workflows.

Workflow of the Event-Driven Architecture with Apache Kafka







Mind Map


2. Backend Implementation
 https://github.com/oyewodayo/uMarketplace

From the shared GitHub repository above, I have implemented a simple version of two microservices (product service and order service) using NodeJS and Fastify and included basic CRUD operations and relations with each other. The diagram below represents the entity relationships and the database architecture design. The database of choice is PostgreSQL which is highly suitable for an eCommerce platform for several reasons due to its robust features, scalability, and data integrity mechanisms. 
It handles large volumes of data and can efficiently scale both vertically (more resources) and horizontally (sharding and replication) to support growing eCommerce businesses. It supports complex queries, JSON data types, and full-text search, making it ideal for product searches and many more. I am aware that you mentioned using scyllaDB in production. I implemented scyllaDb, which is within the repository that I can switch to at any point in time, but due to resource constraints, I could not make use of it for this test.

Database design



To protect data exchanged between the mobile app and backend, I’ve implemented several key security measures:
Transport Layer Security (TLS): I will ensure that all client-server communication uses HTTPS with TLS to encrypt sensitive information, preventing data interception since this happens at the infrastructure level rather than directly in my application code. I have first-hand knowledge and experience with Nginx, Apache, or Dockerized services configuration and cloud services. 
Authentication and Authorization: Secure APIs are protected with token-based authentication to verify user identity and manage access rights effectively.
Input validation and parameterized queries:
I validate all user inputs on both the client and backend to protect against common attacks, like SQL injection.
Content Security Policies:
Fastify’s @fastify/helmet is integrated to protect against cross-site scripting (XSS) and other injection attacks.
Example setup.
Rate Limiting: I apply rate limits to prevent abuse of APIs and protect server resources.
Error Handling: And lastly, I return generic error messages without revealing internal server details to limit information exposure.

Implementation Details
1. Route Definitions
The productRouter defines the following API endpoints to manage product operations:
POST /products: Create a new product.
GET /products: Retrieve a paginated list of products.
PATCH /products/:id: Update the stock for a specific product.
PUT /products/:id: Replace stock details for a specific product.
Each route is connected to controller methods for processing requests and sending appropriate responses.


To maintain code maintainability and separation of concerns, the implementation follows a modular, clean architecture:
Repositories: Handle direct database operations (ProductRepository).
Services: Contain business logic (CatalogService).
Controllers: Process incoming requests and invoke appropriate service methods (ProductController).
Interfaces: Define structured types for request data (ProductQueryString, ProductParams, UpdateStockBody).




Cart Implementation Details
Route Definitions The cartRouter defines the following API endpoints to manage cart operations:
POST /cart: Creates a new cart for a user.
Description: This endpoint takes cart data (e.g., item details) and associates it with the logged-in user, creating a new cart for them.
Input: CartRequestInput containing details such as item title, amount, etc.
Output: A success response with cart details.
Middleware: RequestAuthorizer checks if the user is authenticated.
GET /cart: Retrieves the cart for the logged-in user.
Description: This endpoint fetches the current cart associated with the logged-in user.
Output: Cart details, including line items.
Middleware: RequestAuthorizer ensures the user is authenticated.
PATCH /cart/:lineItemId: Updates a specific item in the user's cart.
Description: This endpoint updates the quantity of a line item in the cart based on the provided lineItemId.
Input: Updated qty in the request body.
Output: Updated cart data.
Middleware: RequestAuthorizer checks if the user is authenticated.
DELETE /cart/:lineItemId: Removes a line item from the user's cart.
Description: This endpoint deletes a specific line item from the user's cart using the provided lineItemId.
Output: Success response with the updated cart.
Middleware: RequestAuthorizer ensures the user is authenticated.


Service Layer The cart service (cart.service.ts) contains the business logic for the cart operations:
CreateCart: Creates a cart for the user by interacting with the repository and adding the provided cart details.
GetCart: Retrieves the cart details associated with the user's ID.
EditCart: Edits the quantity of a specific item in the user's cart.
DeleteCart: Deletes a line item from the cart based on the lineItemId.
Validation
CartRequestSchema: Used to validate the input for creating a new cart, ensuring that all required fields (e.g., item title, price, etc.) are provided and correctly formatted.
Error Handling: If validation fails, a 400 error with the validation error message is returned to the client.

Order Implementation Details
Route Definitions The orderRouter defines the following API endpoints to manage order operations:
POST /orders: Creates a new order based on the user's cart.
Description: This endpoint creates an order from the items in the user's cart, calculates totals, and marks the order as created.
Input: Cart details from the user's cart and shipping information.
Output: Success response with the order details.
Middleware: RequestAuthorizer ensures the user is authenticated.

GET /orders: Retrieves a list of orders for the logged-in user.
Description: This endpoint fetches all the orders made by the logged-in user.
Output: List of orders with details such as order status, items, prices, etc.
Middleware: RequestAuthorizer ensures the user is authenticated.

GET /orders/:id: Retrieves the details of a specific order by order ID.
Description: This endpoint fetches the details of an individual order by its ID.
Output: Order details with itemized list and status.
Middleware: RequestAuthorizer ensures the user is authenticated.

PATCH /orders/:id: Updates an existing order's status.
Description: This endpoint allows for changing the status of an order (e.g., marking it as "shipped").
Input: Updated order status.
Output: Success response with updated order details.
Middleware: RequestAuthorizer ensures the user is authenticated and authorized to modify the order status.

DELETE /orders/:id: Cancels an order.
Description: This endpoint allows users to cancel an order based on the provided order ID.
Output: Success response with cancellation details.
Middleware: RequestAuthorizer ensures the user is authenticated.

Service Layer The order service (order.service.ts) contains the business logic for order operations:
CreateOrder: Creates an order based on the user's cart, including calculating the total price, generating an order ID, and saving the order.
GetOrders: Retrieves all orders associated with the logged-in user.
GetOrder: Retrieves a specific order based on its ID.
UpdateOrderStatus: Updates the status of a specific order CancelOrder: Cancels an order based on its ID.
Validation
OrderRequestSchema: Used to validate the input for creating an order, ensuring that all necessary information is provided.
Error Handling: Similar to the cart service, errors in validation or internal processing are caught and returned to the client with appropriate status codes.

Middleware & Authentication
RequestAuthorizer: This middleware function ensures that the user is authenticated before accessing cart and order endpoints. It checks the user's credentials from the request object and ensures they have proper permissions.





Kafka event-driven communication with order_service and the product_service.
This technical note outlines the implementation details for the backend service integration with Kafka for message brokering and external APIs for product catalog, stock, and user validation services. The key components of the implementation include the message-broker.ts, broker.type.ts, and api.ts files. 
The entity relationship diagram is for the purpose of this test and will be amended for production use as the case may be for relevant fields.
Kafka efficiently broadcasts events to backend consumers, but to notify users in real-time about state changes (like order updates or notifications), a WebSocket connection from the server to the clients will be used.




Key Features
Message Brokering with Kafka:


Producer and consumer connections to Kafka are managed efficiently.
Dynamic topic creation to handle OrderEvents topic.
Message publication and consumption with partition handling.
External API Integration:
Product catalog API for fetching product details and stock information.
Authentication service for user validation.
Error Handling:
Custom error types (AuthorizeError, NotFoundError) for robust error management.
Comprehensive logging using Fastify’s built-in logger.
Kafka Message Broker Implementation (message-broker.ts)
Configuration
CLIENT_ID, GROUP_ID, and broker URLs are configurable via environment variables.
Default values are provided for local development.
Producer Operations
Topic Creation:
Topics are created dynamically if they do not exist.
numPartitions set to 2 and replicationFactor to 1 for broker compatibility.
Message Publishing:
Publishes messages to the OrderEvents topic.
Message headers, keys, and values are configurable.
Returns the result of the publish operation.
Consumer Operations
Connection Management:
Establishes and manages consumer connections.
Message Subscription:


Subscribes to the OrderEvents topic and processes messages.
Commits offsets after message processing to ensure accurate consumption.
Message Handling:


Parses message key and value for event-based processing.
Utilizes the MessageHandler callback for custom logic.

Broker Types (broker.type.ts)
Defines type interfaces for broker operations:
PublishType: Structure for message publication.
MessageHandler: Callback type for message processing.
MessageBrokerType: Interface for producer and consumer operations.

API Service Implementation (api.ts)
Product API Integration
GetProductDetails:


Fetches product details from the catalog service.
Logs errors and throws NotFoundError for missing products.
GetStockDetails:


Retrieves stock information for multiple product IDs.
Logs errors and throws NotFoundError on failure.
User Validation API
ValidateUser:
Validates user authentication by calling the auth service.
Logs requests and responses.
Throws AuthorizeError if the user is unauthorized.
Error Handling
Custom error types (AuthorizeError, NotFoundError) encapsulate API error scenarios.
Fastify’s logging system captures error details for better observability.

Environment Variables
CLIENT_ID: Kafka client identifier.
GROUP_ID: Kafka consumer group ID.
BROKER_1: Kafka broker URL.
CATALOG_BASE_URL: Base URL for the catalog service.
AUTH_SERVICE_BASE_URL: Base URL for the authentication service.

Performance Optimization
Reuse existing Kafka producer and consumer connections to reduce overhead.
Efficient partition handling for better message distribution.
Asynchronous operations to improve response times.
Conclusion
This implementation provides a scalable and efficient backend solution leveraging Kafka for message brokering and external APIs for essential service operations. Robust error handling, logging, and configurability ensure maintainability and adaptability in production environments.





Leadership and Collaboration
As the team lead, my goal is to ensure a smooth integration of microservices and foster effective communication within the backend team and possibly with the mobile developer for smooth error-free implementation. Here’s how I would approach this:

1. Establish Clear Roles and Responsibilities
I will assign specific microservices to individual team members or small sub-teams. For example, one team member will handle the product service, while another will focus on the order service. I will document these responsibilities clearly so everyone knows their role and what is expected of them.

2. Use Agile Methodologies
I will organize our work into sprints, breaking down integration tasks into manageable chunks. We’ll use tools like Jira or Trello to track progress and task management and also hold daily standups to discuss progress, blockers, and next steps. After each sprint, I’ll conduct retrospectives to reflect on what went well and identify areas for improvement.

3. Define Communication Protocols
To keep everyone on the same page, I’ll set up dedicated channels on Slack for specific topics, such as #product-service and #order-service, and other necessary independent communication channels. For updates that don’t require immediate attention, we’ll use email. I’ll also schedule regular weekly meetings to discuss high-level progress and upcoming tasks.

4. Standardize Development Practices
I’ll ensure we define and document API contracts using OpenAPI/Swagger for each microservice. This will help avoid integration issues. We’ll implement a code review process using GitHub to maintain code quality and consistency. Additionally, I’ll create shared libraries for common functionality to reduce duplication and ensure consistency across services.

5. Implement CI/CD Pipelines
I’ll set up automated testing for each microservice using tools like GitHub Actions or Jenkins. This will include unit, integration, and end-to-end tests. We’ll also automate the deployment process to ensure new changes are deployed seamlessly. To monitor the health of our microservices, I’ll use tools like Prometheus and Grafana and set up alerts for critical issues.

6. Use Collaboration Tools
We’ll use Git for version control and follow branching strategies like GitFlow. I’ll ensure we maintain up-to-date documentation for each microservice, including architecture diagrams and API specifications, using Confluence. Regular knowledge-sharing sessions will be organized to keep everyone informed about best practices and new technologies.

7. Foster a Collaborative Culture
I’ll encourage an environment where team members feel comfortable sharing feedback and suggesting improvements. Pair programming will be promoted for complex tasks to facilitate knowledge transfer and improve code quality. Celebrating milestones and achievements will be a priority to keep the team motivated.

8. Handle Cross-Team Dependencies
I’ll identify and document dependencies between microservices, such as the order service depending on the product service for product details. Regular coordination meetings will be scheduled between teams working on interdependent services to discuss progress and resolve issues. Feature flags will be used to gradually roll out new features and minimize the impact of integration issues. This is very important

9. Monitor and Improve Communication
I’ll regularly solicit feedback from team members on the effectiveness of our communication and collaboration. Based on this feedback, I’ll be willing to adjust our strategies and processes. Transparency will be maintained by sharing project status, challenges, and decisions with the entire team.

Scalability Plan
Vertical Scaling: optimize the database and application code. The database is often the bottleneck in many applications. Proper indexing, database caching, database partitioning, reducing latency and optimizing the application code, and query optimization are things that I will give detailed attention to.
Horizontal Scaling: Horizontal scaling involves adding more servers or instances to distribute the load. This approach is ideal for microservice architecture and cloud-native applications.

Here is the Github repository of the code implementation.
https://github.com/oyewodayo/uMarketplace



Temidayo Oyewo.
Email: oyewodayo@gmail.com
