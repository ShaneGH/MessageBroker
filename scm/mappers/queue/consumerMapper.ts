
import entity = require("../../entity/queue");
import dto = require("../../web/dto/queue");

/**Map from a consumer sub entity to a dto*/
class ConsumerMapper {

  /**instance to be used instead of creating a new one*/
  public static instance = new ConsumerMapper();

  toDto(input: entity.IConsumer) : dto.IConsumer{

    if (!input) return null;
    return {
      id: input.consumerId.toHexString(),
      callback_url: input.postUrl
    };
  }
}

export = ConsumerMapper;
