
require 'native'

module Bookmarklet
  module Components
    class Hello
      STYLES = {
        container: {
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }.freeze,
        title: {
          margin: '0 0 15px 0'
        }.freeze,
        button: {
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }.freeze
      }.freeze

      def initialize
        @document = Native(`document`) # Cached document reference
      end

      def build
        container = @document.create_element('div').tap do |el|
          el.style = STYLES[:container]
          add_title(el)
          add_button(el)
        end
      end

      private

      def add_title(parent)
        title = @document.create_element('h1', 'Ruby Bookmarklet').tap do |el|
          el.style = STYLES[:title]
        end
        parent << title
      end

      def add_button(parent)
        button = @document.create_element('button', 'Click Me').tap do |el|
          el.style = STYLES[:button]
          el.add_event_listener('click') do
            Native(`alert`).call('Hello from Ruby!')
          end
        end
        parent << button
      end
    end
  end
end
