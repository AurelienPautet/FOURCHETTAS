/*
 DROP TABLE IF EXISTS orders_items CASCADE;
        DROP TABLE IF EXISTS images CASCADE;
        DROP TABLE IF EXISTS items_types CASCADE;
        DROP TABLE IF EXISTS items_events CASCADE;
        DROP TABLE IF EXISTS items_types_events CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        DROP TABLE IF EXISTS items CASCADE;
        DROP TABLE IF EXISTS events CASCADE;
*/

function initialQuery() {
  return `

        CREATE TABLE IF NOT EXISTS events_backup AS
             SELECT * FROM events;

        CREATE TABLE IF NOT EXISTS items_backup AS
             SELECT * FROM items;

        CREATE TABLE IF NOT EXISTS orders_backup AS
             SELECT * FROM orders;
        
        DROP TABLE IF EXISTS orders_items CASCADE;
        DROP TABLE IF EXISTS images CASCADE;
        DROP TABLE IF EXISTS items_types CASCADE;
        DROP TABLE IF EXISTS items_events CASCADE;
        DROP TABLE IF EXISTS items_types_events CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        DROP TABLE IF EXISTS items CASCADE;
        DROP TABLE IF EXISTS events CASCADE;

        CREATE TABLE IF NOT EXISTS events (
          	id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            form_closing_date DATE NOT NULL,
            form_closing_time TIME NOT NULL,
            img_url TEXT NOT NULL,
            deleted BOOLEAN DEFAULT FALSE
        );
        CREATE TABLE IF NOT EXISTS items (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            type VARCHAR(20) NOT NULL,
            quantity INT NOT NULL,
            img_url TEXT NOT NULL,
            deleted BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            firstname VARCHAR(50) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            event_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            prepared BOOLEAN DEFAULT FALSE,
            preparedAt TIMESTAMP,
            delivered BOOLEAN DEFAULT FALSE,
            deliveredAt TIMESTAMP,
            deleted BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS images (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            data BYTEA NOT NULL,
            mime_type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders_items (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            order_id INT NOT NULL,
            item_id INT NOT NULL,
            ordered_quantity INT NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items(id)
        );

        CREATE TABLE IF NOT EXISTS items_types (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL 
        );

        CREATE TABLE IF NOT EXISTS items_types_events (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            type_id INT NOT NULL,
            event_id INT NOT NULL,
            order_index INT NOT NULL,
            is_required BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (type_id) REFERENCES items_types(id) ON DELETE CASCADE,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS items_events (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            item_id INT NOT NULL,
            event_id INT NOT NULL,
            type_id INT NOT NULL,
            FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
            FOREIGN KEY (type_id) REFERENCES items_types(id) ON DELETE CASCADE
        );
        `;
}
export default initialQuery;
