function initialQuery() {
  return `

        CREATE TABLE IF NOT EXISTS events (
          	id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            time TIME NOT NULL,
            form_closing_date DATE NOT NULL,
            form_closing_time TIME NOT NULL,
            img_url VARCHAR(500) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS items (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            type VARCHAR(20) NOT NULL,
            quantity INT NOT NULL,
            img_url VARCHAR(500) NOT NULL,
            event_id INT NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events(id) 
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            firstname VARCHAR(50) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            event_id INT NOT NULL,
            dish_id INT NOT NULL,
            side_id INT ,
            drink_id INT ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (dish_id) REFERENCES items(id),
            FOREIGN KEY (side_id) REFERENCES items(id),
            FOREIGN KEY (drink_id) REFERENCES items(id)
        );

        
        `;
}
export default initialQuery;
