html_content = <<~HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruby HTML Heredoc Example</title>
  </head>
  <body>
    <header>
      <h1>Welcome to Ruby HTML Heredoc Example</h1>
    </header>
    <main>
      <p>This is a simple example with embedded Ruby code:</p>
      <p>Current date: <%= Time.now.strftime("%Y-%m-%d %H:%M:%S") %></p>
    </main>
    <footer>
      <p>&copy; <%= Time.now.year %> Ruby Example</p>
    </footer>
  </body>
  </html>
HTML

puts html_content