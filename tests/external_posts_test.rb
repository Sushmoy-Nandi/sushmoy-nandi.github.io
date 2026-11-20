require_relative '../_plugins/external-posts'

generator = ExternalPosts::ExternalPostsGenerator.new
documents = []
generator.define_singleton_method(:create_document) do |_site, source, url, content, _config|
  documents << { source: source, url: url, title: content[:title] }
end

rss = <<~XML
  <rss version="2.0"><channel><title>Example</title><link>https://example.test</link><description>Feed</description>
    <item><title>RSS paper</title><link>https://example.test/rss-paper</link><description>Paper</description>
    <pubDate>Mon, 02 Nov 2026 00:00:00 GMT</pubDate></item>
  </channel></rss>
XML
response = Struct.new(:code, :body) do
  def success?
    code == 200
  end
end
requests = []
HTTParty.define_singleton_method(:get) do |url, options|
  requests << [url, options]
  case url
  when /offline/
    raise Timeout::Error, 'offline'
  when /unavailable/
    response.new(503, 'Unavailable')
  when /feed/
    response.new(200, rss)
  else
    response.new(200, '<html><head><title>URL paper</title></head><body><p>Paper</p></body></html>')
  end
end

generator.generate(Struct.new(:config).new({
  'external_sources' => [
    { 'name' => 'Offline RSS', 'rss_url' => 'https://example.test/offline-feed' },
    { 'name' => 'Unavailable RSS', 'rss_url' => 'https://example.test/unavailable-feed' },
    { 'name' => 'Working RSS', 'rss_url' => 'https://example.test/feed' },
    { 'name' => 'URL posts', 'posts' => [
      { 'url' => 'https://example.test/offline', 'published_date' => '2026-11-02' },
      { 'url' => 'https://example.test/unavailable', 'published_date' => '2026-11-02' },
      { 'url' => 'https://example.test/paper', 'published_date' => '2026-11-02' }
    ] }
  ]
}))

raise "Expected both working posts, got #{documents.inspect}" unless documents.map { |doc| doc[:title] } == ['RSS paper', 'URL paper']
raise 'A source was not attempted' unless requests.length == 6
raise 'Missing request timeout' unless requests.all? { |_url, options| options[:timeout] == 15 }
puts 'External post checks passed: failed sources are skipped, working posts are kept, requests have timeouts.'
