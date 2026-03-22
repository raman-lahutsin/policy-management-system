# Policy Management System

## Insurance Policy

Think of an insurance policy like a contract - a written agreement between you and an insurance company. You pay them money regularly (called a "premium"), and in return, they promise to help you financially if something bad happens - like a car accident, a house fire, or a health issue.

## Policy Management System (PMS)

Imagine an insurance company has thousands, even millions, of these contracts with different people. Each one has different details: different names, different coverage amounts, different start and end dates, different prices. Managing all of that on paper or in simple spreadsheets would be a nightmare.

A Policy Management System is basically the **software** (a computer program) that helps the insurance company organize and handle all of those policies in one place. Think of it like a super-smart digital filing cabinet.

Here's a simple walkthrough of a policy's life, and how the system helps at each stage:

1. **Creating a new policy** - When someone buys insurance, the system records all the details: who they are, what's covered, how much they pay, and when coverage starts.
2. **Collecting payments** - It tracks whether customers have paid their premiums on time.
3. **Making changes** - If a customer wants to add something (say, a new driver to their car insurance), the system updates the policy.
4. **Renewals** - When a policy is about to expire, the system can flag it or even automatically renew it.
5. **Claims** - If something bad happens and the customer asks for money, the system helps process that request against the right policy.
6. **Cancellations** - If someone wants to stop their insurance, the system handles ending the contract properly.

## Running with Docker

```bash
# Copy and configure environment variables
cp .env.example .env
# Set RAILS_MASTER_KEY to the value from backend/config/master.key

# Build and start all services
docker compose up --build

# Seed the database (first run only)
docker compose exec backend ./bin/rails db:seed
```

The app will be available at `http://localhost:3000`. Login with `admin@example.com` / `password123`.

To stop: `docker compose down` (add `-v` to also remove the database volume).

## License

See [LICENSE](LICENSE) for details.
