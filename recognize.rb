require 'sinatra'
require 'rb-readline'
require 'pry-byebug'
require 'json'
require 'base64'
require 'net/http'
require 'uri'

before do
  headers "Access-Control-Allow-Origin" => "*"
  headers "Access-Control-Allow-Headers" => "Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept"
end

post "/audio" do
  wav_data = request.body

  wav_file_name = "temp.wav"
  File.open(wav_file_name, 'wb') {|file| file.write(wav_data.read)}

  result = system("flac -f #{wav_file_name}")

  content = File.binread("temp.flac")
  encoded = Base64.strict_encode64(content)
  # Make request to Google Search API
  payload = {
    audio: {content: encoded},
    config: {languageCode: "en-US", encoding: "flac", sampleRateHertz: 44100}
  }
  payload_json = payload.to_json

  uri = URI.parse("https://speech.googleapis.com/")
  https = Net::HTTP.new(uri.host, uri.port)
  https.use_ssl = true
  request = Net::HTTP::Post.new("/v1/speech:recognize?alt=json&key=<key>")
  request["Content-Type"] = "application/json"
  request["Content-Length"] = payload_json.bytesize
  request.body = payload_json
  response = https.request(request)

  response_json = JSON.parse(response.body)
  puts response_json

  content_type :json
  [200, {}, [response.body]]
  #{message: "success".to_json
end

options '/audio' do
end
