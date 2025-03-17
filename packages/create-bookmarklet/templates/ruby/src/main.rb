
require 'native'

module Bookmarklet
  class Application
    STYLES = {
      root: {
        all: 'initial',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '2147483647',
        fontFamily: 'system-ui, sans-serif'
      }.freeze
    }.freeze

    class << self
      def instance
        @instance ||= new
      end
    end

    def initialize
      @document = Native(`document`)
      create_root_element
      mount
      setup_cleanup
    end

    def create_root_element
      @root = @document.create_element('div').tap do |el|
        el.id = 'rb-root'
        el.style = STYLES[:root]
      end
      @document.body.prepend(@root)
    end

    def mount
      @root << Components::Hello.new.build
    end

    def unmount
      @root.remove
      @root = nil
      ObjectSpace.each_object(Components::Hello, &:unbind_events)
    end

    private

    def setup_cleanup
      %x{
        window._bookmarkletCleanup = function() {
          #{unmount}
          Opal.gc(true);
        }
      }
    end
  end

  # Start application
  Application.instance
end
