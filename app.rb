require 'json'
require 'sinatra'

set :public_folder, Proc.new { File.join(root, "public") }
set server: 'thin'

connections = {}

def timestamp
  Time.now.strftime("%H:%M:%S")
end

get '/' do
  erb :index
end

get '/messages' do
  content_type :json
  [
    {"message": "Message 1"},
    {"message": "Message 2"}
  ].to_json
end

get '/connect/:room', provides: 'text/event-stream' do
  room = params[:room]

  stream :keep_open do |out|
    (connections[room] ||= []) << out

    out.callback { connections[room].delete(out) }
  end
end

post '/push/:room' do
  notification = params.merge( {'timestamp' => timestamp}).to_json
  if connections.has_key?(params[:room])
    connections[params[:room]].each { |out| out << "data: #{notification}\n\n"}
  end
end
